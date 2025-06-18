<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProjectManagementController extends Controller
{
    private $asanaBaseUrl = 'https://app.asana.com/api/1.0';
    private $asanaAccessToken;
    private $workspaceId;
    private $projectId;
    private $makeWebhookUrl;

    public function __construct()
    {
        $this->asanaAccessToken = config('services.asana.access_token');
        $this->workspaceId = config('services.asana.workspace_id');
        $this->projectId = config('services.asana.project_id');
        $this->makeWebhookUrl = config('services.make.webhook_url');
    }

    public function createProject()
    {
        try {
            // Create main project
            $projectResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->asanaAccessToken,
                'Content-Type' => 'application/json'
            ])->post($this->asanaBaseUrl . '/projects', [
                'name' => 'POS System Development',
                'workspace' => $this->workspaceId,
                'notes' => 'Point of Sale System Development Project',
                'color' => 'light-green',
                'default_view' => 'list'
            ]);

            if (!$projectResponse->successful()) {
                throw new \Exception('Failed to create Asana project: ' . $projectResponse->body());
            }

            $project = $projectResponse->json()['data'];
            $this->projectId = $project['gid'];

            // Create sections for main tasks
            $sections = [
                'I. Project Setup and Planning',
                'II. System Development',
                'III. Make.com Integrations',
                'IV. Documentation and Deployment',
                'V. Project Closure'
            ];

            foreach ($sections as $sectionName) {
                $this->createSection($sectionName);
            }

            // Create tasks for each section
            $this->createProjectSetupTasks();
            $this->createSystemDevelopmentTasks();
            $this->createMakeIntegrationTasks();
            $this->createDocumentationTasks();
            $this->createProjectClosureTasks();

            // Notify Make.com about project creation
            $this->notifyMakeWebhook('project_created', [
                'project_id' => $this->projectId,
                'project_name' => 'POS System Development',
                'status' => 'created'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'project' => $project
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating Asana project: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create project: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createSection($name)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->asanaAccessToken,
            'Content-Type' => 'application/json'
        ])->post($this->asanaBaseUrl . '/projects/' . $this->projectId . '/sections', [
            'name' => $name
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to create section: ' . $response->body());
        }

        return $response->json()['data'];
    }

    private function createProjectSetupTasks()
    {
        $tasks = [
            [
                'name' => 'Define Project Scope and Objectives',
                'notes' => "Clearly outline what the POS system will and will not do.\n\nMeasurable Goals:\n- Increase transaction speed by 15%\n- Reduce inventory discrepancies by 5%\n- Improve customer satisfaction by 20%\n- Reduce manual data entry by 90%",
                'due_on' => now()->addDays(7)->format('Y-m-d')
            ],
            [
                'name' => 'Create Project Timeline and Milestones',
                'notes' => "Key Milestones:\n- Backend development complete: " . now()->addDays(30)->format('Y-m-d') . "\n- Frontend development complete: " . now()->addDays(45)->format('Y-m-d') . "\n- Integration testing complete: " . now()->addDays(55)->format('Y-m-d') . "\n- UAT complete: " . now()->addDays(60)->format('Y-m-d'),
                'due_on' => now()->addDays(10)->format('Y-m-d')
            ],
            [
                'name' => 'Assign Team Roles and Responsibilities',
                'notes' => "Team Structure:\n- Project Manager: Sir Joven\n- Backend Lead: Sir Villy\n- Frontend Lead: Sir Mark\n- QA Lead: Mam Jen\n- Developers: [To be assigned]\n- Testers: [To be assigned]",
                'due_on' => now()->addDays(5)->format('Y-m-d')
            ],
            [
                'name' => 'Set up Asana Project and Invite Team Members',
                'notes' => "Required Actions:\n1. Create project in Asana\n2. Configure sections and workflows\n3. Invite team members:\n   - Sir Joven\n   - Mam Jen\n   - Sir Villy\n   - Sir Mark\n4. Set up project templates",
                'due_on' => now()->addDays(3)->format('Y-m-d')
            ],
            [
                'name' => 'Choose Development Methodology',
                'notes' => "Selected Methodology: Agile/Scrum\n\nImplementation Plan:\n- 2-week sprint cycles\n- Daily standup meetings\n- Sprint planning every 2 weeks\n- Sprint review and retrospective\n- Backlog grooming sessions",
                'due_on' => now()->addDays(5)->format('Y-m-d')
            ],
            [
                'name' => 'Technology Stack Selection',
                'notes' => "Confirmed Technologies:\n\nFrontend:\n- React 18.x\n- TypeScript 5.x\n- Chart.js for analytics\n- Tailwind CSS for styling\n\nBackend:\n- Laravel 12.x\n- PHP 8.2+\n- MySQL 8.0\n- Redis for caching\n\nDevOps:\n- Git for version control\n- Docker for containerization\n- GitHub Actions for CI/CD",
                'due_on' => now()->addDays(7)->format('Y-m-d')
            ],
            [
                'name' => 'Risk Assessment and Mitigation Planning',
                'notes' => "Identified Risks:\n\n1. Integration Issues\n   - Mitigation: Early integration testing\n   - Contingency: Fallback mechanisms\n\n2. Database Performance\n   - Mitigation: Proper indexing and caching\n   - Contingency: Query optimization\n\n3. Security Vulnerabilities\n   - Mitigation: Regular security audits\n   - Contingency: Security monitoring\n\n4. Timeline Delays\n   - Mitigation: Buffer in estimates\n   - Contingency: Resource reallocation",
                'due_on' => now()->addDays(10)->format('Y-m-d')
            ]
        ];

        foreach ($tasks as $task) {
            $this->createTask($task);
        }
    }

    private function createSystemDevelopmentTasks()
    {
        $tasks = [
            [
                'name' => 'Database Design and Setup',
                'notes' => "Required Database Components:\n\n1. Core Tables:\n   - users\n   - products\n   - categories\n   - inventory\n   - sales\n   - customers\n   - orders\n\n2. Supporting Tables:\n   - user_roles\n   - product_categories\n   - inventory_transactions\n   - sales_items\n   - customer_feedback\n\n3. Analytics Tables:\n   - sales_analytics\n   - inventory_analytics\n   - customer_analytics",
                'due_on' => now()->addDays(14)->format('Y-m-d')
            ],
            [
                'name' => 'Implement Product Management Module',
                'notes' => "Features to Implement:\n\n1. Product CRUD Operations\n   - Create/Edit/Delete products\n   - Bulk import/export\n   - Image management\n\n2. Category Management\n   - Hierarchical categories\n   - Category attributes\n\n3. Product Search\n   - Advanced filtering\n   - Full-text search\n\n4. Product Analytics\n   - Sales performance\n   - Inventory levels\n   - Profit margins",
                'due_on' => now()->addDays(21)->format('Y-m-d')
            ],
            [
                'name' => 'Implement Stock Monitoring Module',
                'notes' => "Features to Implement:\n\n1. Real-time Stock Tracking\n   - Current stock levels\n   - Stock movements\n   - Stock alerts\n\n2. Inventory Management\n   - Stock adjustments\n   - Stock transfers\n   - Stock counts\n\n3. Low Stock Alerts\n   - Configurable thresholds\n   - Email notifications\n   - Dashboard warnings",
                'due_on' => now()->addDays(28)->format('Y-m-d')
            ],
            [
                'name' => 'Implement Payment Transaction Module',
                'notes' => "Features to Implement:\n\n1. Payment Processing\n   - Multiple payment methods\n   - Payment validation\n   - Transaction logging\n\n2. Discount Management\n   - Percentage discounts\n   - Fixed amount discounts\n   - Promotional codes\n\n3. Receipt Generation\n   - Printable receipts\n   - Digital receipts\n   - Email receipts",
                'due_on' => now()->addDays(35)->format('Y-m-d')
            ],
            [
                'name' => 'Implement Reporting Module',
                'notes' => "Reports to Implement:\n\n1. Sales Reports\n   - Daily/Weekly/Monthly sales\n   - Product performance\n   - Payment method analysis\n\n2. Inventory Reports\n   - Stock levels\n   - Stock movements\n   - Low stock items\n\n3. Customer Reports\n   - Customer purchases\n   - Customer feedback\n   - Customer segments",
                'due_on' => now()->addDays(42)->format('Y-m-d')
            ],
            [
                'name' => 'Implement User Authentication',
                'notes' => "Features to Implement:\n\n1. Authentication System\n   - User registration\n   - Login/Logout\n   - Password reset\n\n2. Role-based Access Control\n   - Admin role\n   - Cashier role\n   - Manager role\n\n3. Security Features\n   - Password policies\n   - Session management\n   - Activity logging",
                'due_on' => now()->addDays(21)->format('Y-m-d')
            ],
            [
                'name' => 'Implement Email Receipt Functionality',
                'notes' => "Features to Implement:\n\n1. Email Templates\n   - Receipt template\n   - Order confirmation\n   - Password reset\n\n2. Email Sending\n   - Queue system\n   - Error handling\n   - Delivery tracking\n\n3. Email Customization\n   - Company branding\n   - Dynamic content\n   - Multi-language support",
                'due_on' => now()->addDays(28)->format('Y-m-d')
            ]
        ];

        foreach ($tasks as $task) {
            $this->createTask($task);
        }
    }

    private function createMakeIntegrationTasks()
    {
        $tasks = [
            [
                'name' => 'Set up Make.com Account',
                'notes' => "Required Setup:\n\n1. Account Creation\n   - Create Make.com account\n   - Set up organization\n   - Configure billing\n\n2. Initial Configuration\n   - Set up API connections\n   - Configure webhooks\n   - Test connections",
                'due_on' => now()->addDays(7)->format('Y-m-d')
            ],
            [
                'name' => 'Integrate Asana with Slack',
                'notes' => "Integration Features:\n\n1. Task Notifications\n   - New task creation\n   - Task updates\n   - Task completion\n\n2. Project Updates\n   - Project milestones\n   - Project status\n   - Team mentions\n\n3. Custom Notifications\n   - Priority tasks\n   - Due date reminders\n   - Team assignments",
                'due_on' => now()->addDays(14)->format('Y-m-d')
            ],
            [
                'name' => 'Integrate Asana with respond.io/Intercom',
                'notes' => "Integration Features:\n\n1. Customer Support\n   - Ticket creation\n   - Status updates\n   - Resolution tracking\n\n2. Communication\n   - Customer messages\n   - Automated responses\n   - Follow-up tasks\n\n3. Analytics\n   - Response times\n   - Customer satisfaction\n   - Support metrics",
                'due_on' => now()->addDays(21)->format('Y-m-d')
            ],
            [
                'name' => 'Integrate POS System with Slack',
                'notes' => "Integration Features:\n\n1. Sales Reports\n   - Daily sales summary\n   - High-value transactions\n   - Sales alerts\n\n2. Inventory Alerts\n   - Low stock warnings\n   - Stock updates\n   - Inventory reports\n\n3. System Notifications\n   - System status\n   - Error alerts\n   - Performance metrics",
                'due_on' => now()->addDays(28)->format('Y-m-d')
            ]
        ];

        foreach ($tasks as $task) {
            $this->createTask($task);
        }
    }

    private function createDocumentationTasks()
    {
        $tasks = [
            [
                'name' => 'Create System Documentation',
                'notes' => "Documentation Requirements:\n\n1. Technical Documentation\n   - System architecture\n   - Database schema\n   - API documentation\n\n2. Development Guide\n   - Setup instructions\n   - Coding standards\n   - Best practices\n\n3. Deployment Guide\n   - Server requirements\n   - Installation steps\n   - Configuration guide",
                'due_on' => now()->addDays(49)->format('Y-m-d')
            ],
            [
                'name' => 'Create User Manual',
                'notes' => "Manual Sections:\n\n1. Getting Started\n   - System overview\n   - User roles\n   - Basic navigation\n\n2. Features Guide\n   - Sales process\n   - Inventory management\n   - Reporting\n\n3. Troubleshooting\n   - Common issues\n   - Solutions\n   - Support contact",
                'due_on' => now()->addDays(56)->format('Y-m-d')
            ],
            [
                'name' => 'Document API Endpoints',
                'notes' => "API Documentation:\n\n1. Authentication\n   - Login/Logout\n   - Token management\n\n2. Core Endpoints\n   - Products\n   - Inventory\n   - Sales\n\n3. Integration Endpoints\n   - Webhooks\n   - External services\n   - Third-party integrations",
                'due_on' => now()->addDays(49)->format('Y-m-d')
            ]
        ];

        foreach ($tasks as $task) {
            $this->createTask($task);
        }
    }

    private function createProjectClosureTasks()
    {
        $tasks = [
            [
                'name' => 'Final Project Review',
                'notes' => "Review Areas:\n\n1. Project Goals\n   - Scope completion\n   - Quality metrics\n   - Performance targets\n\n2. Technical Review\n   - Code quality\n   - System performance\n   - Security audit\n\n3. Documentation Review\n   - Completeness\n   - Accuracy\n   - Usability",
                'due_on' => now()->addDays(60)->format('Y-m-d')
            ],
            [
                'name' => 'Gather Feedback',
                'notes' => "Feedback Collection:\n\n1. User Feedback\n   - System usability\n   - Feature satisfaction\n   - Improvement suggestions\n\n2. Team Feedback\n   - Development process\n   - Tools and resources\n   - Team collaboration\n\n3. Stakeholder Feedback\n   - Business impact\n   - ROI assessment\n   - Future needs",
                'due_on' => now()->addDays(63)->format('Y-m-d')
            ],
            [
                'name' => 'Project Handoff',
                'notes' => "Handoff Components:\n\n1. System Handover\n   - Source code\n   - Database\n   - Configuration\n\n2. Documentation\n   - User manuals\n   - Technical docs\n   - Training materials\n\n3. Knowledge Transfer\n   - Training sessions\n   - Support handover\n   - Maintenance procedures",
                'due_on' => now()->addDays(65)->format('Y-m-d')
            ],
            [
                'name' => 'Documentation Finalization',
                'notes' => "Final Documentation:\n\n1. Update All Docs\n   - Technical docs\n   - User guides\n   - API docs\n\n2. Version Control\n   - Document versions\n   - Change history\n   - Release notes\n\n3. Archive Project\n   - Project files\n   - Communication logs\n   - Meeting minutes",
                'due_on' => now()->addDays(67)->format('Y-m-d')
            ]
        ];

        foreach ($tasks as $task) {
            $this->createTask($task);
        }
    }

    private function createTask($taskData)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->asanaAccessToken,
            'Content-Type' => 'application/json'
        ])->post($this->asanaBaseUrl . '/tasks', [
            'name' => $taskData['name'],
            'notes' => $taskData['notes'],
            'projects' => [$this->projectId],
            'workspace' => $this->workspaceId,
            'due_on' => $taskData['due_on']
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to create task: ' . $response->body());
        }

        $task = $response->json()['data'];

        // Notify Make.com about task creation
        $this->notifyMakeWebhook('task_created', [
            'task_id' => $task['gid'],
            'task_name' => $taskData['name'],
            'due_date' => $taskData['due_on']
        ]);

        return $task;
    }

    private function notifyMakeWebhook($event, $data)
    {
        if (!$this->makeWebhookUrl) {
            return;
        }

        try {
            Http::post($this->makeWebhookUrl, [
                'event' => $event,
                'data' => $data,
                'timestamp' => now()->toIso8601String()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to notify Make.com webhook: ' . $e->getMessage());
        }
    }
}
