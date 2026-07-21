import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/education_model.dart';

class EducationRepository {
  final DioClient _client;

  EducationRepository(this._client);

  Future<List<EducationModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.education);
    return (response.data as List)
        .map((e) => EducationModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<EducationModel> create(Map<String, dynamic> body) async {
    final response = await _client.dio.post(Endpoints.education, data: body);
    return EducationModel.fromJson(response.data);
  }

  Future<EducationModel> update(int id, Map<String, dynamic> body) async {
    final response =
        await _client.dio.put(Endpoints.educationById(id), data: body);
    return EducationModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.educationById(id));
  }
}
