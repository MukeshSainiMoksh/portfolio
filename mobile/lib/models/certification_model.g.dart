// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'certification_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CertificationModelImpl _$$CertificationModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CertificationModelImpl(
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      issuer: json['issuer'] as String,
      credentialId: json['credential_id'] as String?,
      credentialUrl: json['credential_url'] as String?,
      issueDate: json['issue_date'] as String?,
      expiryDate: json['expiry_date'] as String?,
      description: json['description'] as String?,
      badgeUrl: json['badge_url'] as String?,
      displayOrder: (json['display_order'] as num).toInt(),
      isActive: json['is_active'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$$CertificationModelImplToJson(
        _$CertificationModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'issuer': instance.issuer,
      'credential_id': instance.credentialId,
      'credential_url': instance.credentialUrl,
      'issue_date': instance.issueDate,
      'expiry_date': instance.expiryDate,
      'description': instance.description,
      'badge_url': instance.badgeUrl,
      'display_order': instance.displayOrder,
      'is_active': instance.isActive,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
