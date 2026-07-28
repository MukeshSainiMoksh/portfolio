import 'package:freezed_annotation/freezed_annotation.dart';

part 'contact_message_model.freezed.dart';
part 'contact_message_model.g.dart';

@freezed
class ContactMessageModel with _$ContactMessageModel {
  const factory ContactMessageModel({
    required int id,
    required String name,
    required String email,
    String? subject,
    required String message,
    @JsonKey(name: 'is_read') required bool isRead,
    @JsonKey(name: 'is_replied') required bool isReplied,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _ContactMessageModel;

  factory ContactMessageModel.fromJson(Map<String, dynamic> json) =>
      _$ContactMessageModelFromJson(json);
}
