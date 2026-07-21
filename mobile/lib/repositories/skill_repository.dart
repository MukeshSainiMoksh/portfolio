import 'package:dio/dio.dart';
import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/skill_model.dart';

class SkillRepository {
  final DioClient _client;

  SkillRepository(this._client);

  Future<List<SkillModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.skills);
    return (response.data as List)
        .map((e) => SkillModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<SkillModel> create(Map<String, dynamic> body) async {
    final response = await _client.dio.post(Endpoints.skills, data: body);
    return SkillModel.fromJson(response.data);
  }

  Future<SkillModel> update(int id, Map<String, dynamic> body) async {
    final response = await _client.dio.put(Endpoints.skillById(id), data: body);
    return SkillModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.skillById(id));
  }
}
