import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/site_asset_model.dart';

class AssetRepository {
  final DioClient _client;

  AssetRepository(this._client);

  Future<SiteAssetsStatus> getStatus() async {
    final response = await _client.dio.get(Endpoints.assets);
    return SiteAssetsStatus.fromJson(response.data as Map<String, dynamic>);
  }

  /// Uploads a picked file. Works on mobile (path) and web (bytes).
  Future<SiteAssetInfo> upload(
    String endpoint,
    PlatformFile file, {
    void Function(int sent, int total)? onProgress,
  }) async {
    final multipart = file.path != null
        ? await MultipartFile.fromFile(file.path!, filename: file.name)
        : MultipartFile.fromBytes(file.bytes!, filename: file.name);

    final form = FormData.fromMap({'file': multipart});
    final response = await _client.dio.post(
      endpoint,
      data: form,
      onSendProgress: onProgress,
    );
    return SiteAssetInfo.fromJson(response.data as Map<String, dynamic>);
  }
}
