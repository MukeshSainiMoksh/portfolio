import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/experience_model.dart';

class ExperienceRepository {
  final DioClient _client;

  ExperienceRepository(this._client);

  Future<List<ExperienceModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.experience);
    return (response.data as List)
        .map((e) => ExperienceModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ExperienceModel> create(Map<String, dynamic> body) async {
    final response = await _client.dio.post(Endpoints.experience, data: body);
    return ExperienceModel.fromJson(response.data);
  }

  Future<ExperienceModel> update(int id, Map<String, dynamic> body) async {
    final response =
        await _client.dio.put(Endpoints.experienceById(id), data: body);
    return ExperienceModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.experienceById(id));
  }
}
