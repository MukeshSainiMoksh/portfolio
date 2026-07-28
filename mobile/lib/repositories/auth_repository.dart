import 'package:dio/dio.dart';
import '../core/config/endpoints.dart';
import '../core/network/api_exception.dart';
import '../core/network/dio_client.dart';
import '../core/storage/secure_storage.dart';
import '../models/auth/token_response.dart';
import '../models/auth/user_model.dart';

class AuthRepository {
  final DioClient _client;
  final SecureStorageService _storage;

  AuthRepository(this._client, this._storage);

  Future<TokenResponse> login(String username, String password) async {
    try {
      final response = await _client.dio.post(
        Endpoints.login,
        data: {'username': username, 'password': password},
        options: Options(contentType: 'application/x-www-form-urlencoded'),
      );
      final token = TokenResponse.fromJson(response.data);
      await _storage.saveToken(token.accessToken);
      await _storage.saveUsername(username);
      return token;
    } on DioException catch (e) {
      // always throw the unwrapped ApiException — callers catch on ApiException
      throw _handleError(e);
    }
  }

  Future<UserModel> getCurrentUser() async {
    try {
      final response = await _client.dio.get(Endpoints.me);
      return UserModel.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _client.dio.post(Endpoints.logout);
    } catch (_) {
      // Logout always succeeds locally, server errors don't matter
    } finally {
      await _storage.clearAll();
    }
  }

  ApiException _handleError(DioException e) {
    if (e.error is ApiException) {
      return e.error as ApiException;
    }
    return ApiException.network('Network error: ${e.message}');
  }
}
