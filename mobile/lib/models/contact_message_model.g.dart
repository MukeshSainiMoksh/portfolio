// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_message_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ContactMessageModelImpl _$$ContactMessageModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ContactMessageModelImpl(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      email: json['email'] as String,
      subject: json['subject'] as String?,
      message: json['message'] as String,
      isRead: json['is_read'] as bool,
      isReplied: json['is_replied'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$$ContactMessageModelImplToJson(
        _$ContactMessageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'subject': instance.subject,
      'message': instance.message,
      'is_read': instance.isRead,
      'is_replied': instance.isReplied,
      'created_at': instance.createdAt.toIso8601String(),
    };
