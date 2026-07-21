// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media_file_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MediaFileModelImpl _$$MediaFileModelImplFromJson(Map<String, dynamic> json) =>
    _$MediaFileModelImpl(
      id: (json['id'] as num).toInt(),
      filename: json['filename'] as String,
      originalName: json['original_name'] as String,
      fileUrl: json['file_url'] as String,
      fileType: json['file_type'] as String,
      mimeType: json['mime_type'] as String?,
      fileSize: (json['file_size'] as num).toInt(),
      altText: json['alt_text'] as String?,
      description: json['description'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$MediaFileModelImplToJson(
        _$MediaFileModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'filename': instance.filename,
      'original_name': instance.originalName,
      'file_url': instance.fileUrl,
      'file_type': instance.fileType,
      'mime_type': instance.mimeType,
      'file_size': instance.fileSize,
      'alt_text': instance.altText,
      'description': instance.description,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
