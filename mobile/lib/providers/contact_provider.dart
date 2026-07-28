import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/contact_message_model.dart';
import '../repositories/contact_repository.dart';
import 'auth_provider.dart';

final contactRepositoryProvider = Provider<ContactRepository>(
  (ref) => ContactRepository(ref.read(dioClientProvider)),
);

class MessagesNotifier extends AsyncNotifier<List<ContactMessageModel>> {
  @override
  Future<List<ContactMessageModel>> build() async {
    return ref.read(contactRepositoryProvider).getAll();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(contactRepositoryProvider).getAll(),
    );
  }

  Future<void> setRead(int id, bool isRead) async {
    final updated =
        await ref.read(contactRepositoryProvider).update(id, isRead: isRead);
    _replace(updated);
  }

  Future<void> setReplied(int id, bool isReplied) async {
    final updated = await ref
        .read(contactRepositoryProvider)
        .update(id, isReplied: isReplied);
    _replace(updated);
  }

  Future<void> delete(int id) async {
    await ref.read(contactRepositoryProvider).delete(id);
    state = AsyncData(
      (state.value ?? []).where((m) => m.id != id).toList(),
    );
  }

  void _replace(ContactMessageModel updated) {
    state = AsyncData([
      for (final m in state.value ?? <ContactMessageModel>[])
        m.id == updated.id ? updated : m,
    ]);
  }
}

final messagesProvider =
    AsyncNotifierProvider<MessagesNotifier, List<ContactMessageModel>>(
  MessagesNotifier.new,
);

/// Unread count derived from the loaded list — drives dashboard badge.
final unreadMessagesCountProvider = Provider<int>((ref) {
  final messages = ref.watch(messagesProvider).value;
  if (messages == null) return 0;
  return messages.where((m) => !m.isRead).length;
});
