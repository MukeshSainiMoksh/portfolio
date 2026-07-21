import 'package:dio/dio.dart';
import 'api_exception.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final statusCode = err.response?.statusCode;

    switch (statusCode) {
      case 401:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: ApiException.unauthorized('Session expired. Please login again.'),
            type: DioExceptionType.badResponse,
            response: err.response,
          ),
        );
        break;
      case 403:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: ApiException.forbidden('Access denied.'),
            type: DioExceptionType.badResponse,
            response: err.response,
          ),
        );
        break;
      case 404:
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: ApiException.notFound('Resource not found.'),
            type: DioExceptionType.badResponse,
            response: err.response,
          ),
        );
        break;
      case 422:
        final detail = err.response?.data?['detail'] ?? 'Validation error';
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: ApiException.validation(detail.toString()),
            type: DioExceptionType.badResponse,
            response: err.response,
          ),
        );
        break;
      default:
        if (err.type == DioExceptionType.connectionTimeout ||
            err.type == DioExceptionType.receiveTimeout ||
            err.type == DioExceptionType.sendTimeout) {
          handler.reject(
            DioException(
              requestOptions: err.requestOptions,
              error: ApiException.network('Network connection failed.'),
              type: err.type,
            ),
          );
        } else {
          handler.reject(err);
        }
    }
  }
}
