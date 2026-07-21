// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'education_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$EducationModelImpl _$$EducationModelImplFromJson(Map<String, dynamic> json) =>
    _$EducationModelImpl(
      id: (json['id'] as num).toInt(),
      degree: json['degree'] as String,
      institution: json['institution'] as String,
      location: json['location'] as String?,
      year: json['year'] as String?,
      grade: json['grade'] as String?,
      description: json['description'] as String?,
      type: json['type'] as String,
      iconClass: json['icon_class'] as String?,
      displayOrder: (json['display_order'] as num).toInt(),
      isActive: json['is_active'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$EducationModelImplToJson(
        _$EducationModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'degree': instance.degree,
      'institution': instance.institution,
      'location': instance.location,
      'year': instance.year,
      'grade': instance.grade,
      'description': instance.description,
      'type': instance.type,
      'icon_class': instance.iconClass,
      'display_order': instance.displayOrder,
      'is_active': instance.isActive,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
