import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/education_provider.dart';

class EducationFormScreen extends ConsumerStatefulWidget {
  final int? educationId;

  const EducationFormScreen({super.key, this.educationId});

  bool get isEditing => educationId != null;

  @override
  ConsumerState<EducationFormScreen> createState() => _EducationFormScreenState();
}

class _EducationFormScreenState extends ConsumerState<EducationFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _degreeCtrl = TextEditingController();
  final _institutionCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();
  final _gradeCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _iconClassCtrl = TextEditingController();
  final _displayOrderCtrl = TextEditingController(text: '0');
  String _type = 'degree';
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  static const List<String> _typeOptions = ['degree', 'certification', 'course'];

  @override
  void dispose() {
    _degreeCtrl.dispose();
    _institutionCtrl.dispose();
    _locationCtrl.dispose();
    _yearCtrl.dispose();
    _gradeCtrl.dispose();
    _descCtrl.dispose();
    _iconClassCtrl.dispose();
    _displayOrderCtrl.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final eduAsync = ref.read(educationProvider);
    eduAsync.whenData((items) {
      final item = items.where((e) => e.id == widget.educationId).firstOrNull;
      if (item != null) {
        _degreeCtrl.text = item.degree;
        _institutionCtrl.text = item.institution;
        _locationCtrl.text = item.location ?? '';
        _yearCtrl.text = item.year ?? '';
        _gradeCtrl.text = item.grade ?? '';
        _descCtrl.text = item.description ?? '';
        _iconClassCtrl.text = item.iconClass ?? '';
        _displayOrderCtrl.text = item.displayOrder.toString();
        setState(() {
          _type = item.type;
          _isActive = item.isActive;
          _initialized = true;
        });
      }
    });
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final data = {
      'degree': _degreeCtrl.text.trim(),
      'institution': _institutionCtrl.text.trim(),
      if (_locationCtrl.text.isNotEmpty) 'location': _locationCtrl.text.trim(),
      if (_yearCtrl.text.isNotEmpty) 'year': _yearCtrl.text.trim(),
      if (_gradeCtrl.text.isNotEmpty) 'grade': _gradeCtrl.text.trim(),
      if (_descCtrl.text.isNotEmpty) 'description': _descCtrl.text.trim(),
      if (_iconClassCtrl.text.isNotEmpty) 'icon_class': _iconClassCtrl.text.trim(),
      'type': _type,
      'display_order': int.tryParse(_displayOrderCtrl.text) ?? 0,
      'is_active': _isActive,
    };
    try {
      if (widget.isEditing) {
        await ref.read(educationProvider.notifier).editItem(widget.educationId!, data);
      } else {
        await ref.read(educationProvider.notifier).create(data);
      }
      if (mounted) context.go('/education');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.neonPink),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    _initFromExisting();
    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(widget.isEditing ? 'Edit Education' : 'New Education'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/education'),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextFormField(
                        controller: _degreeCtrl,
                        decoration: const InputDecoration(labelText: 'Degree / Title *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _institutionCtrl,
                        decoration: const InputDecoration(labelText: 'Institution *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _locationCtrl,
                        decoration: const InputDecoration(labelText: 'Location'),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _yearCtrl,
                              decoration: const InputDecoration(labelText: 'Year'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _gradeCtrl,
                              decoration: const InputDecoration(labelText: 'Grade / CGPA'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _descCtrl,
                        decoration: const InputDecoration(labelText: 'Description'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _iconClassCtrl,
                        decoration: const InputDecoration(labelText: 'Icon Class'),
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _type,
                        decoration: const InputDecoration(labelText: 'Type'),
                        items: _typeOptions.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                        onChanged: (v) => setState(() => _type = v ?? 'degree'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _displayOrderCtrl,
                        decoration: const InputDecoration(labelText: 'Display Order'),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        title: const Text('Active'),
                        value: _isActive,
                        activeColor: AppColors.neonCyan,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setState(() => _isActive = v),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.neonCyan,
                      foregroundColor: AppColors.background,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(widget.isEditing ? 'Update Education' : 'Create Education'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
