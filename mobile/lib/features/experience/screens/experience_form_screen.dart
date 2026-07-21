import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/experience_provider.dart';

class ExperienceFormScreen extends ConsumerStatefulWidget {
  final int? experienceId;

  const ExperienceFormScreen({super.key, this.experienceId});

  bool get isEditing => experienceId != null;

  @override
  ConsumerState<ExperienceFormScreen> createState() => _ExperienceFormScreenState();
}

class _ExperienceFormScreenState extends ConsumerState<ExperienceFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _jobTitleCtrl = TextEditingController();
  final _companyCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _startDateCtrl = TextEditingController();
  final _endDateCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _technologiesCtrl = TextEditingController();
  final _displayOrderCtrl = TextEditingController(text: '0');
  final List<TextEditingController> _responsibilityControllers = [TextEditingController()];
  final List<TextEditingController> _achievementControllers = [TextEditingController()];
  bool _isCurrent = false;
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _jobTitleCtrl.dispose();
    _companyCtrl.dispose();
    _locationCtrl.dispose();
    _startDateCtrl.dispose();
    _endDateCtrl.dispose();
    _descCtrl.dispose();
    _technologiesCtrl.dispose();
    _displayOrderCtrl.dispose();
    for (var c in _responsibilityControllers) c.dispose();
    for (var c in _achievementControllers) c.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final expAsync = ref.read(experienceProvider);
    expAsync.whenData((items) {
      final item = items.where((e) => e.id == widget.experienceId).firstOrNull;
      if (item != null) {
        _jobTitleCtrl.text = item.jobTitle;
        _companyCtrl.text = item.company;
        _locationCtrl.text = item.location ?? '';
        _startDateCtrl.text = item.startDate;
        _endDateCtrl.text = item.endDate ?? '';
        _descCtrl.text = item.description ?? '';
        _technologiesCtrl.text = item.technologies ?? '';
        _displayOrderCtrl.text = item.displayOrder.toString();

        for (var c in _responsibilityControllers) c.dispose();
        _responsibilityControllers.clear();
        final resps = item.responsibilities ?? [];
        for (final r in resps.isEmpty ? [''] : resps) {
          _responsibilityControllers.add(TextEditingController(text: r));
        }

        for (var c in _achievementControllers) c.dispose();
        _achievementControllers.clear();
        final achs = item.achievements ?? [];
        for (final a in achs.isEmpty ? [''] : achs) {
          _achievementControllers.add(TextEditingController(text: a));
        }

        setState(() {
          _isCurrent = item.isCurrent;
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
      'job_title': _jobTitleCtrl.text.trim(),
      'company': _companyCtrl.text.trim(),
      if (_locationCtrl.text.isNotEmpty) 'location': _locationCtrl.text.trim(),
      'start_date': _startDateCtrl.text.trim(),
      if (!_isCurrent && _endDateCtrl.text.isNotEmpty) 'end_date': _endDateCtrl.text.trim(),
      'is_current': _isCurrent,
      if (_descCtrl.text.isNotEmpty) 'description': _descCtrl.text.trim(),
      if (_technologiesCtrl.text.isNotEmpty) 'technologies': _technologiesCtrl.text.trim(),
      'responsibilities': _responsibilityControllers.map((c) => c.text.trim()).where((s) => s.isNotEmpty).toList(),
      'achievements': _achievementControllers.map((c) => c.text.trim()).where((s) => s.isNotEmpty).toList(),
      'display_order': int.tryParse(_displayOrderCtrl.text) ?? 0,
      'is_active': _isActive,
    };
    try {
      if (widget.isEditing) {
        await ref.read(experienceProvider.notifier).editItem(widget.experienceId!, data);
      } else {
        await ref.read(experienceProvider.notifier).create(data);
      }
      if (mounted) context.go('/experience');
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

  Widget _buildDynamicList(List<TextEditingController> controllers, String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 8),
        ...controllers.asMap().entries.map((entry) {
          final i = entry.key;
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: entry.value,
                    decoration: InputDecoration(hintText: '$label ${i + 1}'),
                  ),
                ),
                if (controllers.length > 1)
                  IconButton(
                    icon: const Icon(Icons.remove_circle, color: AppColors.neonPink),
                    onPressed: () {
                      setState(() {
                        controllers[i].dispose();
                        controllers.removeAt(i);
                      });
                    },
                  ),
              ],
            ),
          );
        }),
        TextButton.icon(
          onPressed: () => setState(() => controllers.add(TextEditingController())),
          icon: const Icon(Icons.add, color: AppColors.neonCyan),
          label: Text('Add $label', style: const TextStyle(color: AppColors.neonCyan)),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    _initFromExisting();
    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: Text(widget.isEditing ? 'Edit Experience' : 'New Experience'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/experience'),
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
                        controller: _jobTitleCtrl,
                        decoration: const InputDecoration(labelText: 'Job Title *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _companyCtrl,
                        decoration: const InputDecoration(labelText: 'Company *'),
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
                              controller: _startDateCtrl,
                              decoration: const InputDecoration(labelText: 'Start Date * (YYYY-MM-DD)'),
                              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _endDateCtrl,
                              decoration: const InputDecoration(labelText: 'End Date (YYYY-MM-DD)'),
                              enabled: !_isCurrent,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        title: const Text('Currently Working Here'),
                        value: _isCurrent,
                        activeColor: AppColors.neonCyan,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setState(() => _isCurrent = v),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _descCtrl,
                        decoration: const InputDecoration(labelText: 'Description'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _technologiesCtrl,
                        decoration: const InputDecoration(labelText: 'Technologies (comma-separated)'),
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
                      const SizedBox(height: 16),
                      _buildDynamicList(_responsibilityControllers, 'Responsibility'),
                      const SizedBox(height: 16),
                      _buildDynamicList(_achievementControllers, 'Achievement'),
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
                    child: Text(widget.isEditing ? 'Update Experience' : 'Create Experience'),
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
