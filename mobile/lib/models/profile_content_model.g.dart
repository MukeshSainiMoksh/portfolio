// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_content_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProfileContentModelImpl _$$ProfileContentModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ProfileContentModelImpl(
      id: (json['id'] as num).toInt(),
      section: json['section'] as String,
      fieldName: json['field_name'] as String,
      fieldValue: json['field_value'] as String?,
      fieldType: json['field_type'] as String,
      isActive: json['is_active'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$ProfileContentModelImplToJson(
        _$ProfileContentModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'section': instance.section,
      'field_name': instance.fieldName,
      'field_value': instance.fieldValue,
      'field_type': instance.fieldType,
      'is_active': instance.isActive,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
