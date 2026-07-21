import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/project_model.dart';
import '../repositories/project_repository.dart';
import 'auth_provider.dart';

final projectRepositoryProvider = Provider<ProjectRepository>(
  (ref) => ProjectRepository(ref.read(dioClientProvider)),
);

class ProjectsNotifier extends AsyncNotifier<List<ProjectModel>> {
  @override
  Future<List<ProjectModel>> build() async {
    return ref.read(projectRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(projectRepositoryProvider).getAll(),
    );
  }

  Future<void> create(Map<String, dynamic> data) async {
    await ref.read(projectRepositoryProvider).create(data);
    await refresh();
  }

  Future<void> editItem(int id, Map<String, dynamic> data) async {
    await ref.read(projectRepositoryProvider).update(id, data);
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(projectRepositoryProvider).delete(id);
    await refresh();
  }
}

final projectsProvider =
    AsyncNotifierProvider<ProjectsNotifier, List<ProjectModel>>(
  ProjectsNotifier.new,
);
