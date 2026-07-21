import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/dio_client.dart';
import '../models/media_file_model.dart';
import '../repositories/media_repository.dart';
import 'auth_provider.dart';

final mediaRepositoryProvider = Provider<MediaRepository>(
  (ref) => MediaRepository(ref.read(dioClientProvider)),
);

class MediaNotifier extends AsyncNotifier<List<MediaFileModel>> {
  @override
  Future<List<MediaFileModel>> build() async {
    return ref.read(mediaRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(mediaRepositoryProvider).getAll(),
    );
  }

  Future<void> upload(File file, {String? altText, String? description}) async {
    await ref.read(mediaRepositoryProvider).upload(
          file,
          altText: altText,
          description: description,
        );
    await refresh();
  }

  Future<void> updateMetadata(
    int id, {
    String? altText,
    String? description,
  }) async {
    await ref.read(mediaRepositoryProvider).updateMetadata(
          id,
          altText: altText,
          description: description,
        );
    await refresh();
  }

  Future<void> delete(int id) async {
    await ref.read(mediaRepositoryProvider).delete(id);
    await refresh();
  }
}

final mediaProvider =
    AsyncNotifierProvider<MediaNotifier, List<MediaFileModel>>(
  MediaNotifier.new,
);
