import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/project_model.dart';

class ProjectRepository {
  final DioClient _client;

  ProjectRepository(this._client);

  Future<List<ProjectModel>> getAll() async {
    final response = await _client.dio.get(Endpoints.projects);
    return (response.data as List)
        .map((e) => ProjectModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ProjectModel> create(Map<String, dynamic> body) async {
    final response = await _client.dio.post(Endpoints.projects, data: body);
    return ProjectModel.fromJson(response.data);
  }

  Future<ProjectModel> update(int id, Map<String, dynamic> body) async {
    final response =
        await _client.dio.put(Endpoints.projectById(id), data: body);
    return ProjectModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.projectById(id));
  }
}
