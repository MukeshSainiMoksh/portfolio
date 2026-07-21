import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path/path.dart' as path;
import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/media_file_model.dart';

class MediaRepository {
  final DioClient _client;

  MediaRepository(this._client);

  Future<List<MediaFileModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.mediaFiles);
    return (response.data as List)
        .map((e) => MediaFileModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<MediaFileModel> upload(
    File file, {
    String? altText,
    String? description,
  }) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        file.path,
        filename: path.basename(file.path),
      ),
      if (altText != null && altText.isNotEmpty) 'alt_text': altText,
      if (description != null && description.isNotEmpty)
        'description': description,
    });

    final response = await _client.dio.post(
      Endpoints.mediaUpload,
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    return MediaFileModel.fromJson(response.data);
  }

  Future<MediaFileModel> updateMetadata(
    int id, {
    String? altText,
    String? description,
  }) async {
    final formData = FormData.fromMap({
      if (altText != null) 'alt_text': altText,
      if (description != null) 'description': description,
    });

    final response = await _client.dio.put(
      Endpoints.mediaFileById(id),
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    return MediaFileModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.mediaFileById(id));
  }
}
