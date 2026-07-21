// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'profile_content_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ProfileContentModel _$ProfileContentModelFromJson(Map<String, dynamic> json) {
  return _ProfileContentModel.fromJson(json);
}

/// @nodoc
mixin _$ProfileContentModel {
  int get id => throw _privateConstructorUsedError;
  String get section => throw _privateConstructorUsedError;
  @JsonKey(name: 'field_name')
  String get fieldName => throw _privateConstructorUsedError;
  @JsonKey(name: 'field_value')
  String? get fieldValue => throw _privateConstructorUsedError;
  @JsonKey(name: 'field_type')
  String get fieldType => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_active')
  bool get isActive => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ProfileContentModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProfileContentModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProfileContentModelCopyWith<ProfileContentModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProfileContentModelCopyWith<$Res> {
  factory $ProfileContentModelCopyWith(
          ProfileContentModel value, $Res Function(ProfileContentModel) then) =
      _$ProfileContentModelCopyWithImpl<$Res, ProfileContentModel>;
  @useResult
  $Res call(
      {int id,
      String section,
      @JsonKey(name: 'field_name') String fieldName,
      @JsonKey(name: 'field_value') String? fieldValue,
      @JsonKey(name: 'field_type') String fieldType,
      @JsonKey(name: 'is_active') bool isActive,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class _$ProfileContentModelCopyWithImpl<$Res, $Val extends ProfileContentModel>
    implements $ProfileContentModelCopyWith<$Res> {
  _$ProfileContentModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProfileContentModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? section = null,
    Object? fieldName = null,
    Object? fieldValue = freezed,
    Object? fieldType = null,
    Object? isActive = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      section: null == section
          ? _value.section
          : section // ignore: cast_nullable_to_non_nullable
              as String,
      fieldName: null == fieldName
          ? _value.fieldName
          : fieldName // ignore: cast_nullable_to_non_nullable
              as String,
      fieldValue: freezed == fieldValue
          ? _value.fieldValue
          : fieldValue // ignore: cast_nullable_to_non_nullable
              as String?,
      fieldType: null == fieldType
          ? _value.fieldType
          : fieldType // ignore: cast_nullable_to_non_nullable
              as String,
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
abstract class _$$ProfileContentModelImplCopyWith<$Res>
    implements $ProfileContentModelCopyWith<$Res> {
  factory _$$ProfileContentModelImplCopyWith(_$ProfileContentModelImpl value,
          $Res Function(_$ProfileContentModelImpl) then) =
      __$$ProfileContentModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int id,
      String section,
      @JsonKey(name: 'field_name') String fieldName,
      @JsonKey(name: 'field_value') String? fieldValue,
      @JsonKey(name: 'field_type') String fieldType,
      @JsonKey(name: 'is_active') bool isActive,
      @JsonKey(name: 'created_at') DateTime createdAt,
      @JsonKey(name: 'updated_at') DateTime updatedAt});
}

/// @nodoc
class __$$ProfileContentModelImplCopyWithImpl<$Res>
    extends _$ProfileContentModelCopyWithImpl<$Res, _$ProfileContentModelImpl>
    implements _$$ProfileContentModelImplCopyWith<$Res> {
  __$$ProfileContentModelImplCopyWithImpl(_$ProfileContentModelImpl _value,
      $Res Function(_$ProfileContentModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ProfileContentModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? section = null,
    Object? fieldName = null,
    Object? fieldValue = freezed,
    Object? fieldType = null,
    Object? isActive = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$ProfileContentModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      section: null == section
          ? _value.section
          : section // ignore: cast_nullable_to_non_nullable
              as String,
      fieldName: null == fieldName
          ? _value.fieldName
          : fieldName // ignore: cast_nullable_to_non_nullable
              as String,
      fieldValue: freezed == fieldValue
          ? _value.fieldValue
          : fieldValue // ignore: cast_nullable_to_non_nullable
              as String?,
      fieldType: null == fieldType
          ? _value.fieldType
          : fieldType // ignore: cast_nullable_to_non_nullable
              as String,
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
class _$ProfileContentModelImpl implements _ProfileContentModel {
  const _$ProfileContentModelImpl(
      {required this.id,
      required this.section,
      @JsonKey(name: 'field_name') required this.fieldName,
      @JsonKey(name: 'field_value') this.fieldValue,
      @JsonKey(name: 'field_type') required this.fieldType,
      @JsonKey(name: 'is_active') required this.isActive,
      @JsonKey(name: 'created_at') required this.createdAt,
      @JsonKey(name: 'updated_at') required this.updatedAt});

  factory _$ProfileContentModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProfileContentModelImplFromJson(json);

  @override
  final int id;
  @override
  final String section;
  @override
  @JsonKey(name: 'field_name')
  final String fieldName;
  @override
  @JsonKey(name: 'field_value')
  final String? fieldValue;
  @override
  @JsonKey(name: 'field_type')
  final String fieldType;
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
    return 'ProfileContentModel(id: $id, section: $section, fieldName: $fieldName, fieldValue: $fieldValue, fieldType: $fieldType, isActive: $isActive, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProfileContentModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.section, section) || other.section == section) &&
            (identical(other.fieldName, fieldName) ||
                other.fieldName == fieldName) &&
            (identical(other.fieldValue, fieldValue) ||
                other.fieldValue == fieldValue) &&
            (identical(other.fieldType, fieldType) ||
                other.fieldType == fieldType) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, section, fieldName,
      fieldValue, fieldType, isActive, createdAt, updatedAt);

  /// Create a copy of ProfileContentModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProfileContentModelImplCopyWith<_$ProfileContentModelImpl> get copyWith =>
      __$$ProfileContentModelImplCopyWithImpl<_$ProfileContentModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProfileContentModelImplToJson(
      this,
    );
  }
}

abstract class _ProfileContentModel implements ProfileContentModel {
  const factory _ProfileContentModel(
          {required final int id,
          required final String section,
          @JsonKey(name: 'field_name') required final String fieldName,
          @JsonKey(name: 'field_value') final String? fieldValue,
          @JsonKey(name: 'field_type') required final String fieldType,
          @JsonKey(name: 'is_active') required final bool isActive,
          @JsonKey(name: 'created_at') required final DateTime createdAt,
          @JsonKey(name: 'updated_at') required final DateTime updatedAt}) =
      _$ProfileContentModelImpl;

  factory _ProfileContentModel.fromJson(Map<String, dynamic> json) =
      _$ProfileContentModelImpl.fromJson;

  @override
  int get id;
  @override
  String get section;
  @override
  @JsonKey(name: 'field_name')
  String get fieldName;
  @override
  @JsonKey(name: 'field_value')
  String? get fieldValue;
  @override
  @JsonKey(name: 'field_type')
  String get fieldType;
  @override
  @JsonKey(name: 'is_active')
  bool get isActive;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;
  @override
  @JsonKey(name: 'updated_at')
  DateTime get updatedAt;

  /// Create a copy of ProfileContentModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProfileContentModelImplCopyWith<_$ProfileContentModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
