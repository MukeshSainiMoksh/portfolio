import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';
import '../storage/secure_storage.dart';
import 'auth_interceptor.dart';
import 'error_interceptor.dart';

class DioClient {
  late final Dio _dio;

  DioClient(SecureStorageService storage) {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: Duration(milliseconds: AppConfig.connectTimeoutMs),
        receiveTimeout: Duration(milliseconds: AppConfig.receiveTimeoutMs),
        contentType: 'application/json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(storage),
      ErrorInterceptor(),
      // Debug builds only — release must never log request/response bodies
      // (login carries credentials, every call carries the bearer token)
      if (kDebugMode)
        LogInterceptor(
          requestBody: false,
          responseBody: false,
          logPrint: (obj) => debugPrint(obj.toString()),
        ),
    ]);
  }

  Dio get dio => _dio;
}
