import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/loading_overlay.dart';
import '../../../providers/project_provider.dart';

class ProjectFormScreen extends ConsumerStatefulWidget {
  final int? projectId;

  const ProjectFormScreen({super.key, this.projectId});

  bool get isEditing => projectId != null;

  @override
  ConsumerState<ProjectFormScreen> createState() => _ProjectFormScreenState();
}

class _ProjectFormScreenState extends ConsumerState<ProjectFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _taglineCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _roleCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _liveUrlCtrl = TextEditingController();
  final _githubUrlCtrl = TextEditingController();
  final _imageUrlCtrl = TextEditingController();
  final _iconClassCtrl = TextEditingController();
  final _projectTagCtrl = TextEditingController();
  final _displayOrderCtrl = TextEditingController(text: '0');
  final List<TextEditingController> _techControllers = [TextEditingController()];
  final List<TextEditingController> _featureControllers = [TextEditingController()];
  bool _isFeatured = false;
  bool _isActive = true;
  bool _loading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _taglineCtrl.dispose();
    _descCtrl.dispose();
    _roleCtrl.dispose();
    _durationCtrl.dispose();
    _liveUrlCtrl.dispose();
    _githubUrlCtrl.dispose();
    _imageUrlCtrl.dispose();
    _iconClassCtrl.dispose();
    _projectTagCtrl.dispose();
    _displayOrderCtrl.dispose();
    for (var c in _techControllers) c.dispose();
    for (var c in _featureControllers) c.dispose();
    super.dispose();
  }

  void _initFromExisting() {
    if (_initialized || !widget.isEditing) return;
    final projectsAsync = ref.read(projectsProvider);
    projectsAsync.whenData((projects) {
      final project = projects.where((p) => p.id == widget.projectId).firstOrNull;
      if (project != null) {
        _titleCtrl.text = project.title;
        _taglineCtrl.text = project.tagline ?? '';
        _descCtrl.text = project.description ?? '';
        _roleCtrl.text = project.role ?? '';
        _durationCtrl.text = project.duration ?? '';
        _liveUrlCtrl.text = project.liveUrl ?? '';
        _githubUrlCtrl.text = project.githubUrl ?? '';
        _imageUrlCtrl.text = project.imageUrl ?? '';
        _iconClassCtrl.text = project.iconClass ?? '';
        _projectTagCtrl.text = project.projectTag ?? '';
        _displayOrderCtrl.text = project.displayOrder.toString();

        for (var c in _techControllers) c.dispose();
        _techControllers.clear();
        final techs = project.technologies ?? [];
        for (final t in techs.isEmpty ? [''] : techs) {
          _techControllers.add(TextEditingController(text: t));
        }

        for (var c in _featureControllers) c.dispose();
        _featureControllers.clear();
        final features = project.features ?? [];
        for (final f in features.isEmpty ? [''] : features) {
          _featureControllers.add(TextEditingController(text: f));
        }

        setState(() {
          _isFeatured = project.isFeatured;
          _isActive = project.isActive;
          _initialized = true;
        });
      }
    });
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final data = {
      'title': _titleCtrl.text.trim(),
      if (_taglineCtrl.text.isNotEmpty) 'tagline': _taglineCtrl.text.trim(),
      if (_descCtrl.text.isNotEmpty) 'description': _descCtrl.text.trim(),
      if (_roleCtrl.text.isNotEmpty) 'role': _roleCtrl.text.trim(),
      if (_durationCtrl.text.isNotEmpty) 'duration': _durationCtrl.text.trim(),
      if (_liveUrlCtrl.text.isNotEmpty) 'live_url': _liveUrlCtrl.text.trim(),
      if (_githubUrlCtrl.text.isNotEmpty) 'github_url': _githubUrlCtrl.text.trim(),
      if (_imageUrlCtrl.text.isNotEmpty) 'image_url': _imageUrlCtrl.text.trim(),
      if (_iconClassCtrl.text.isNotEmpty) 'icon_class': _iconClassCtrl.text.trim(),
      if (_projectTagCtrl.text.isNotEmpty) 'project_tag': _projectTagCtrl.text.trim(),
      'technologies': _techControllers.map((c) => c.text.trim()).where((s) => s.isNotEmpty).toList(),
      'features': _featureControllers.map((c) => c.text.trim()).where((s) => s.isNotEmpty).toList(),
      'is_featured': _isFeatured,
      'is_active': _isActive,
      'display_order': int.tryParse(_displayOrderCtrl.text) ?? 0,
    };
    try {
      if (widget.isEditing) {
        await ref.read(projectsProvider.notifier).editItem(widget.projectId!, data);
      } else {
        await ref.read(projectsProvider.notifier).create(data);
      }
      if (mounted) context.go('/projects');
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
          title: Text(widget.isEditing ? 'Edit Project' : 'New Project'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.go('/projects'),
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
                        controller: _titleCtrl,
                        decoration: const InputDecoration(labelText: 'Title *'),
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _taglineCtrl,
                        decoration: const InputDecoration(labelText: 'Tagline'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _descCtrl,
                        decoration: const InputDecoration(labelText: 'Description'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _roleCtrl,
                              decoration: const InputDecoration(labelText: 'Role'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _durationCtrl,
                              decoration: const InputDecoration(labelText: 'Duration'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _projectTagCtrl,
                        decoration: const InputDecoration(labelText: 'Project Tag'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _liveUrlCtrl,
                        decoration: const InputDecoration(labelText: 'Live URL'),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _githubUrlCtrl,
                        decoration: const InputDecoration(labelText: 'GitHub URL'),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _imageUrlCtrl,
                        decoration: const InputDecoration(labelText: 'Image URL'),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _iconClassCtrl,
                        decoration: const InputDecoration(labelText: 'Icon Class'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _displayOrderCtrl,
                        decoration: const InputDecoration(labelText: 'Display Order'),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 16),
                      SwitchListTile(
                        title: const Text('Featured'),
                        value: _isFeatured,
                        activeColor: AppColors.neonCyan,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setState(() => _isFeatured = v),
                      ),
                      SwitchListTile(
                        title: const Text('Active'),
                        value: _isActive,
                        activeColor: AppColors.neonCyan,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setState(() => _isActive = v),
                      ),
                      const SizedBox(height: 16),
                      _buildDynamicList(_techControllers, 'Technology'),
                      const SizedBox(height: 16),
                      _buildDynamicList(_featureControllers, 'Feature'),
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
                    child: Text(widget.isEditing ? 'Update Project' : 'Create Project'),
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
