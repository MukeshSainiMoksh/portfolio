// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact_message_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ContactMessageModel _$ContactMessageModelFromJson(Map<String, dynamic> json) {
  return _ContactMessageModel.fromJson(json);
}

/// @nodoc
mixin _$ContactMessageModel {
  int get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get subject => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_read')
  bool get isRead => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_replied')
  bool get isReplied => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this ContactMessageModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactMessageModelCopyWith<ContactMessageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactMessageModelCopyWith<$Res> {
  factory $ContactMessageModelCopyWith(
          ContactMessageModel value, $Res Function(ContactMessageModel) then) =
      _$ContactMessageModelCopyWithImpl<$Res, ContactMessageModel>;
  @useResult
  $Res call(
      {int id,
      String name,
      String email,
      String? subject,
      String message,
      @JsonKey(name: 'is_read') bool isRead,
      @JsonKey(name: 'is_replied') bool isReplied,
      @JsonKey(name: 'created_at') DateTime createdAt});
}

/// @nodoc
class _$ContactMessageModelCopyWithImpl<$Res, $Val extends ContactMessageModel>
    implements $ContactMessageModelCopyWith<$Res> {
  _$ContactMessageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? subject = freezed,
    Object? message = null,
    Object? isRead = null,
    Object? isReplied = null,
    Object? createdAt = null,
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
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      subject: freezed == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String?,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      isReplied: null == isReplied
          ? _value.isReplied
          : isReplied // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ContactMessageModelImplCopyWith<$Res>
    implements $ContactMessageModelCopyWith<$Res> {
  factory _$$ContactMessageModelImplCopyWith(_$ContactMessageModelImpl value,
          $Res Function(_$ContactMessageModelImpl) then) =
      __$$ContactMessageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int id,
      String name,
      String email,
      String? subject,
      String message,
      @JsonKey(name: 'is_read') bool isRead,
      @JsonKey(name: 'is_replied') bool isReplied,
      @JsonKey(name: 'created_at') DateTime createdAt});
}

/// @nodoc
class __$$ContactMessageModelImplCopyWithImpl<$Res>
    extends _$ContactMessageModelCopyWithImpl<$Res, _$ContactMessageModelImpl>
    implements _$$ContactMessageModelImplCopyWith<$Res> {
  __$$ContactMessageModelImplCopyWithImpl(_$ContactMessageModelImpl _value,
      $Res Function(_$ContactMessageModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ContactMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? subject = freezed,
    Object? message = null,
    Object? isRead = null,
    Object? isReplied = null,
    Object? createdAt = null,
  }) {
    return _then(_$ContactMessageModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as int,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      subject: freezed == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String?,
      message: null == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      isReplied: null == isReplied
          ? _value.isReplied
          : isReplied // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ContactMessageModelImpl implements _ContactMessageModel {
  const _$ContactMessageModelImpl(
      {required this.id,
      required this.name,
      required this.email,
      this.subject,
      required this.message,
      @JsonKey(name: 'is_read') required this.isRead,
      @JsonKey(name: 'is_replied') required this.isReplied,
      @JsonKey(name: 'created_at') required this.createdAt});

  factory _$ContactMessageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ContactMessageModelImplFromJson(json);

  @override
  final int id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? subject;
  @override
  final String message;
  @override
  @JsonKey(name: 'is_read')
  final bool isRead;
  @override
  @JsonKey(name: 'is_replied')
  final bool isReplied;
  @override
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  @override
  String toString() {
    return 'ContactMessageModel(id: $id, name: $name, email: $email, subject: $subject, message: $message, isRead: $isRead, isReplied: $isReplied, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactMessageModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.subject, subject) || other.subject == subject) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.isReplied, isReplied) ||
                other.isReplied == isReplied) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, email, subject,
      message, isRead, isReplied, createdAt);

  /// Create a copy of ContactMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactMessageModelImplCopyWith<_$ContactMessageModelImpl> get copyWith =>
      __$$ContactMessageModelImplCopyWithImpl<_$ContactMessageModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactMessageModelImplToJson(
      this,
    );
  }
}

abstract class _ContactMessageModel implements ContactMessageModel {
  const factory _ContactMessageModel(
          {required final int id,
          required final String name,
          required final String email,
          final String? subject,
          required final String message,
          @JsonKey(name: 'is_read') required final bool isRead,
          @JsonKey(name: 'is_replied') required final bool isReplied,
          @JsonKey(name: 'created_at') required final DateTime createdAt}) =
      _$ContactMessageModelImpl;

  factory _ContactMessageModel.fromJson(Map<String, dynamic> json) =
      _$ContactMessageModelImpl.fromJson;

  @override
  int get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get subject;
  @override
  String get message;
  @override
  @JsonKey(name: 'is_read')
  bool get isRead;
  @override
  @JsonKey(name: 'is_replied')
  bool get isReplied;
  @override
  @JsonKey(name: 'created_at')
  DateTime get createdAt;

  /// Create a copy of ContactMessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactMessageModelImplCopyWith<_$ContactMessageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
