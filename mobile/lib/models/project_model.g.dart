// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProjectModelImpl _$$ProjectModelImplFromJson(Map<String, dynamic> json) =>
    _$ProjectModelImpl(
      id: (json['id'] as num).toInt(),
      title: json['title'] as String,
      tagline: json['tagline'] as String?,
      description: json['description'] as String?,
      role: json['role'] as String?,
      duration: json['duration'] as String?,
      technologies: (json['technologies'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      features: (json['features'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      liveUrl: json['live_url'] as String?,
      githubUrl: json['github_url'] as String?,
      imageUrl: json['image_url'] as String?,
      iconClass: json['icon_class'] as String?,
      projectTag: json['project_tag'] as String?,
      isFeatured: json['is_featured'] as bool,
      displayOrder: (json['display_order'] as num).toInt(),
      isActive: json['is_active'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$ProjectModelImplToJson(_$ProjectModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'tagline': instance.tagline,
      'description': instance.description,
      'role': instance.role,
      'duration': instance.duration,
      'technologies': instance.technologies,
      'features': instance.features,
      'live_url': instance.liveUrl,
      'github_url': instance.githubUrl,
      'image_url': instance.imageUrl,
      'icon_class': instance.iconClass,
      'project_tag': instance.projectTag,
      'is_featured': instance.isFeatured,
      'display_order': instance.displayOrder,
      'is_active': instance.isActive,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
