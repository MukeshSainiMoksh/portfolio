enum ApiErrorType { unauthorized, forbidden, notFound, validation, network, unknown }

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final ApiErrorType type;

  const ApiException({
    required this.message,
    this.statusCode,
    required this.type,
  });

  factory ApiException.unauthorized(String msg) => ApiException(
    message: msg,
    statusCode: 401,
    type: ApiErrorType.unauthorized,
  );

  factory ApiException.forbidden(String msg) => ApiException(
    message: msg,
    statusCode: 403,
    type: ApiErrorType.forbidden,
  );

  factory ApiException.notFound(String msg) => ApiException(
    message: msg,
    statusCode: 404,
    type: ApiErrorType.notFound,
  );

  factory ApiException.validation(String msg) => ApiException(
    message: msg,
    statusCode: 422,
    type: ApiErrorType.validation,
  );

  factory ApiException.network(String msg) => ApiException(
    message: msg,
    type: ApiErrorType.network,
  );

  factory ApiException.unknown(String msg) => ApiException(
    message: msg,
    type: ApiErrorType.unknown,
  );

  @override
  String toString() => 'ApiException: $message';
}
