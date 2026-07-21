import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/profile_content_model.dart';

class ProfileRepository {
  final DioClient _client;

  ProfileRepository(this._client);

  Future<List<ProfileContentModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.profile);
    return (response.data as List)
        .map((e) => ProfileContentModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ProfileContentModel> create(Map<String, dynamic> body) async {
    final response = await _client.dio.post(Endpoints.profile, data: body);
    return ProfileContentModel.fromJson(response.data);
  }

  Future<ProfileContentModel> update(int id, Map<String, dynamic> body) async {
    final response =
        await _client.dio.put(Endpoints.profileById(id), data: body);
    return ProfileContentModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.profileById(id));
  }
}
