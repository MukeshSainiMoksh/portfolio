// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'certification_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CertificationModel _$CertificationModelFromJson(Map<String, dynamic> json) {
  return _CertificationModel.fromJson(json);
}

/// @nodoc
mixin _$CertificationModel {
  int get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get issuer => throw _privateConstructorUsedError;
  @JsonKey(name: 'credential_id')
  String? get credentialId => throw _privateConstructorUsedError;
  @JsonKey(name: 'credential_url')
  String? get credentialUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'issue_date')
  String? get issueDate => throw _privateConstructorUsedError;
  @JsonKey(name: 'expiry_date')
  String? get expiryDate => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  @JsonKey(name: 'badge_url')
  String? get badgeUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'display_order')
  int get displayOrder => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_active')
  bool get isActive => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CertificationModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CertificationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CertificationModelCopyWith<CertificationModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CertificationModelCopyWith<$Res> {
  factory $CertificationModelCopyWith(
          CertificationModel value, $Res Function(CertificationModel) then) =
      _$CertificationModelCopyWithImpl<$Res, CertificationModel>;
  @useResult
  $Res call(
      {int id,
      String name,
      String issuer,
      @JsonKey(name: 'credential_id') String? credentialId,
      @JsonKey(name: 'credential_url') String? credentialUrl,
      @JsonKey(name: 'issue_date') String? issueDate,
      @JsonKey(name: 'expiry_date') String? expiryDate,
      String? description,
      @JsonKey(name: 'badge_url') String? badgeUrl,
      @JsonKey(name: 'display_order') int displayOrder,
      @JsonKey(name: 'is_active') bool isActive,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class _$CertificationModelCopyWithImpl<$Res, $Val extends CertificationModel>
    implements $CertificationModelCopyWith<$Res> {
  _$CertificationModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CertificationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? issuer = null,
    Object? credentialId = freezed,
    Object? credentialUrl = freezed,
    Object? issueDate = freezed,
    Object? expiryDate = freezed,
    Object? description = freezed,
    Object? badgeUrl = freezed,
    Object? displayOrder = null,
    Object? isActive = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      issuer: null == issuer
          ? _value.issuer
          : issuer // ignore: cast_nullable_to_non_nullable
              as String,
      credentialId: freezed == credentialId
          ? _value.credentialId
          : credentialId // ignore: cast_nullable_to_non_nullable
              as String?,
      credentialUrl: freezed == credentialUrl
          ? _value.credentialUrl
          : credentialUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      issueDate: freezed == issueDate
          ? _value.issueDate
          : issueDate // ignore: cast_nullable_to_non_nullable
              as String?,
      expiryDate: freezed == expiryDate
          ? _value.expiryDate
          : expiryDate // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      badgeUrl: freezed == badgeUrl
          ? _value.badgeUrl
          : badgeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      displayOrder: null == displayOrder
          ? _value.displayOrder
          : displayOrder // ignore: cast_nullable_to_non_nullable
              as int,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CertificationModelImplCopyWith<$Res>
    implements $CertificationModelCopyWith<$Res> {
  factory _$$CertificationModelImplCopyWith(_$CertificationModelImpl value,
          $Res Function(_$CertificationModelImpl) then) =
      __$$CertificationModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int id,
      String name,
      String issuer,
      @JsonKey(name: 'credential_id') String? credentialId,
      @JsonKey(name: 'credential_url') String? credentialUrl,
      @JsonKey(name: 'issue_date') String? issueDate,
      @JsonKey(name: 'expiry_date') String? expiryDate,
      String? description,
      @JsonKey(name: 'badge_url') String? badgeUrl,
      @JsonKey(name: 'display_order') int displayOrder,
      @JsonKey(name: 'is_active') bool isActive,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class __$$CertificationModelImplCopyWithImpl<$Res>
    extends _$CertificationModelCopyWithImpl<$Res, _$CertificationModelImpl>
    implements _$$CertificationModelImplCopyWith<$Res> {
  __$$CertificationModelImplCopyWithImpl(_$CertificationModelImpl _value,
      $Res Function(_$CertificationModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CertificationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? issuer = null,
    Object? credentialId = freezed,
    Object? credentialUrl = freezed,
    Object? issueDate = freezed,
    Object? expiryDate = freezed,
    Object? description = freezed,
    Object? badgeUrl = freezed,
    Object? displayOrder = null,
    Object? isActive = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$CertificationModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      issuer: null == issuer
          ? _value.issuer
          : issuer // ignore: cast_nullable_to_non_nullable
              as String,
      credentialId: freezed == credentialId
          ? _value.credentialId
          : credentialId // ignore: cast_nullable_to_non_nullable
              as String?,
      credentialUrl: freezed == credentialUrl
          ? _value.credentialUrl
          : credentialUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      issueDate: freezed == issueDate
          ? _value.issueDate
          : issueDate // ignore: cast_nullable_to_non_nullable
              as String?,
      expiryDate: freezed == expiryDate
          ? _value.expiryDate
          : expiryDate // ignore: cast_nullable_to_non_nullable
              as String?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      badgeUrl: freezed == badgeUrl
          ? _value.badgeUrl
          : badgeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      displayOrder: null == displayOrder
          ? _value.displayOrder
          : displayOrder // ignore: cast_nullable_to_non_nullable
              as int,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CertificationModelImpl implements _CertificationModel {
  const _$CertificationModelImpl(
      {required this.id,
      required this.name,
      required this.issuer,
      @JsonKey(name: 'credential_id') this.credentialId,
      @JsonKey(name: 'credential_url') this.credentialUrl,
      @JsonKey(name: 'issue_date') this.issueDate,
      @JsonKey(name: 'expiry_date') this.expiryDate,
      this.description,
      @JsonKey(name: 'badge_url') this.badgeUrl,
      @JsonKey(name: 'display_order') required this.displayOrder,
      @JsonKey(name: 'is_active') required this.isActive,
      @JsonKey(name: 'created_at') required this.createdAt,
      @JsonKey(name: 'updated_at') required this.updatedAt});

  factory _$CertificationModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CertificationModelImplFromJson(json);

  @override
  final int id;
  @override
  final String name;
  @override
  final String issuer;
  @override
  @JsonKey(name: 'credential_id')
  final String? credentialId;
  @override
  @JsonKey(name: 'credential_url')
  final String? credentialUrl;
  @override
  @JsonKey(name: 'issue_date')
  final String? issueDate;
  @override
  @JsonKey(name: 'expiry_date')
  final String? expiryDate;
  @override
  final String? description;
  @override
  @JsonKey(name: 'badge_url')
  final String? badgeUrl;
  @override
  @JsonKey(name: 'display_order')
  final int displayOrder;
  @override
  @JsonKey(name: 'is_active')
  final bool isActive;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @override
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  @override
  String toString() {
    return 'CertificationModel(id: $id, name: $name, issuer: $issuer, credentialId: $credentialId, credentialUrl: $credentialUrl, issueDate: $issueDate, expiryDate: $expiryDate, description: $description, badgeUrl: $badgeUrl, displayOrder: $displayOrder, isActive: $isActive, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CertificationModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.issuer, issuer) || other.issuer == issuer) &&
            (identical(other.credentialId, credentialId) ||
                other.credentialId == credentialId) &&
            (identical(other.credentialUrl, credentialUrl) ||
                other.credentialUrl == credentialUrl) &&
            (identical(other.issueDate, issueDate) ||
                other.issueDate == issueDate) &&
            (identical(other.expiryDate, expiryDate) ||
                other.expiryDate == expiryDate) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.badgeUrl, badgeUrl) ||
                other.badgeUrl == badgeUrl) &&
            (identical(other.displayOrder, displayOrder) ||
                other.displayOrder == displayOrder) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      issuer,
      credentialId,
      credentialUrl,
      issueDate,
      expiryDate,
      description,
      badgeUrl,
      displayOrder,
      isActive,
      createdAt,
      updatedAt);

  /// Create a copy of CertificationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CertificationModelImplCopyWith<_$CertificationModelImpl> get copyWith =>
      __$$CertificationModelImplCopyWithImpl<_$CertificationModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CertificationModelImplToJson(
      this,
    );
  }
}

abstract class _CertificationModel implements CertificationModel {
  const factory _CertificationModel(
          {required final int id,
          required final String name,
          required final String issuer,
          @JsonKey(name: 'credential_id') final String? credentialId,
          @JsonKey(name: 'credential_url') final String? credentialUrl,
          @JsonKey(name: 'issue_date') final String? issueDate,
          @JsonKey(name: 'expiry_date') final String? expiryDate,
          final String? description,
          @JsonKey(name: 'badge_url') final String? badgeUrl,
          @JsonKey(name: 'display_order') required final int displayOrder,
          @JsonKey(name: 'is_active') required final bool isActive,
          @JsonKey(name: 'created_at') required final DateTime createdAt,
          @JsonKey(name: 'updated_at') required final DateTime updatedAt}) =
      _$CertificationModelImpl;

  factory _CertificationModel.fromJson(Map<String, dynamic> json) =
      _$CertificationModelImpl.fromJson;

  @override
  int get id;
  @override
  String get name;
  @override
  String get issuer;
  @override
  @JsonKey(name: 'credential_id')
  String? get credentialId;
  @override
  @JsonKey(name: 'credential_url')
  String? get credentialUrl;
  @override
  @JsonKey(name: 'issue_date')
  String? get issueDate;
  @override
  @JsonKey(name: 'expiry_date')
  String? get expiryDate;
  @override
  String? get description;
  @override
  @JsonKey(name: 'badge_url')
  String? get badgeUrl;
  @override
  @JsonKey(name: 'display_order')
  int get displayOrder;
  @override
  @JsonKey(name: 'is_active')
  bool get isActive;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt;

  /// Create a copy of CertificationModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CertificationModelImplCopyWith<_$CertificationModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
