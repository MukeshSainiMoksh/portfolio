import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/skills/screens/skills_list_screen.dart';
import '../../features/skills/screens/skill_form_screen.dart';
import '../../features/projects/screens/projects_list_screen.dart';
import '../../features/projects/screens/project_form_screen.dart';
import '../../features/experience/screens/experience_list_screen.dart';
import '../../features/experience/screens/experience_form_screen.dart';
import '../../features/education/screens/education_list_screen.dart';
import '../../features/education/screens/education_form_screen.dart';
import '../../features/certifications/screens/certifications_list_screen.dart';
import '../../features/certifications/screens/certification_form_screen.dart';
import '../../features/profile/screens/profile_list_screen.dart';
import '../../features/profile/screens/profile_field_form_screen.dart';
import '../../features/media/screens/media_gallery_screen.dart';
import 'route_names.dart';
import '../../providers/auth_provider.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: RouteNames.login,
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isLoggingIn = state.matchedLocation == RouteNames.login;

      if (!isLoggedIn && !isLoggingIn) {
        return RouteNames.login;
      }
      if (isLoggedIn && isLoggingIn) {
        return RouteNames.dashboard;
      }
      return null;
    },
    routes: [
      GoRoute(
        path: RouteNames.login,
        name: 'login',
        pageBuilder: (context, state) => const MaterialPage(child: LoginScreen()),
      ),
      ShellRoute(
        builder: (context, state, child) => _DashboardShell(child: child),
        routes: [
          GoRoute(
            path: RouteNames.dashboard,
            name: 'dashboard',
            pageBuilder: (context, state) => const MaterialPage(child: DashboardScreen()),
          ),
          // Skills
          GoRoute(
            path: RouteNames.skills,
            name: 'skills',
            pageBuilder: (context, state) => const MaterialPage(child: SkillsListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'skill-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: SkillFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'skill-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: SkillFormScreen(skillId: id));
                },
              ),
            ],
          ),
          // Projects
          GoRoute(
            path: RouteNames.projects,
            name: 'projects',
            pageBuilder: (context, state) => const MaterialPage(child: ProjectsListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'project-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: ProjectFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'project-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: ProjectFormScreen(projectId: id));
                },
              ),
            ],
          ),
          // Experience
          GoRoute(
            path: RouteNames.experience,
            name: 'experience',
            pageBuilder: (context, state) => const MaterialPage(child: ExperienceListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'experience-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: ExperienceFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'experience-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: ExperienceFormScreen(experienceId: id));
                },
              ),
            ],
          ),
          // Education
          GoRoute(
            path: RouteNames.education,
            name: 'education',
            pageBuilder: (context, state) => const MaterialPage(child: EducationListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'education-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: EducationFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'education-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: EducationFormScreen(educationId: id));
                },
              ),
            ],
          ),
          // Certifications
          GoRoute(
            path: RouteNames.certifications,
            name: 'certifications',
            pageBuilder: (context, state) => const MaterialPage(child: CertificationsListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'certification-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: CertificationFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'certification-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: CertificationFormScreen(certificationId: id));
                },
              ),
            ],
          ),
          // Profile
          GoRoute(
            path: RouteNames.profile,
            name: 'profile',
            pageBuilder: (context, state) => const MaterialPage(child: ProfileListScreen()),
            routes: [
              GoRoute(
                path: 'create',
                name: 'profile-create',
                pageBuilder: (context, state) => const MaterialPage(
                  child: ProfileFieldFormScreen(),
                ),
              ),
              GoRoute(
                path: ':id/edit',
                name: 'profile-edit',
                pageBuilder: (context, state) {
                  final id = int.tryParse(state.pathParameters['id'] ?? '');
                  return MaterialPage(child: ProfileFieldFormScreen(profileId: id));
                },
              ),
            ],
          ),
          // Media
          GoRoute(
            path: RouteNames.media,
            name: 'media',
            pageBuilder: (context, state) => const MaterialPage(child: MediaGalleryScreen()),
          ),
        ],
      ),
    ],
  );
});

class _DashboardShell extends StatefulWidget {
  final Widget child;

  const _DashboardShell({required this.child});

  @override
  State<_DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends State<_DashboardShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() => _selectedIndex = index);
          _navigateToTab(index);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Skills'),
          BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Projects'),
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: 'More'),
          BottomNavigationBarItem(icon: Icon(Icons.image), label: 'Media'),
        ],
      ),
    );
  }

  void _navigateToTab(int index) {
    switch (index) {
      case 0:
        context.go(RouteNames.dashboard);
        break;
      case 1:
        context.go(RouteNames.skills);
        break;
      case 2:
        context.go(RouteNames.projects);
        break;
      case 3:
        context.go(RouteNames.experience);
        break;
      case 4:
        context.go(RouteNames.media);
        break;
    }
  }
}
