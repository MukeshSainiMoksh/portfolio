import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/certification_model.dart';

class CertificationRepository {
  final DioClient _client;

  CertificationRepository(this._client);

  Future<List<CertificationModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.certifications);
    return (response.data as List)
        .map((e) => CertificationModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<CertificationModel> create(Map<String, dynamic> body) async {
    final response =
        await _client.dio.post(Endpoints.certifications, data: body);
    return CertificationModel.fromJson(response.data);
  }

  Future<CertificationModel> update(int id, Map<String, dynamic> body) async {
    final response = await _client.dio.put(Endpoints.certificationById(id),
        data: body);
    return CertificationModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.certificationById(id));
  }
}
