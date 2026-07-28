import '../core/config/endpoints.dart';
import '../core/network/dio_client.dart';
import '../models/contact_message_model.dart';

class ContactRepository {
  final DioClient _client;

  ContactRepository(this._client);

  Future<List<ContactMessageModel>> getAll({bool unreadOnly = false}) async {
    final response = await _client.dio.get(
      Endpoints.contacts,
      queryParameters: unreadOnly ? {'unread_only': true} : null,
    );
    return (response.data as List)
        .map((e) => ContactMessageModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ContactMessageModel> update(
    int id, {
    bool? isRead,
    bool? isReplied,
  }) async {
    final response = await _client.dio.patch(
      Endpoints.contactById(id),
      data: {
        if (isRead != null) 'is_read': isRead,
        if (isReplied != null) 'is_replied': isReplied,
      },
    );
    return ContactMessageModel.fromJson(response.data);
  }

  Future<void> delete(int id) async {
    await _client.dio.delete(Endpoints.contactById(id));
  }
}
