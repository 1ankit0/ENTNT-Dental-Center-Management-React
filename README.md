# Dental Center Management Dashboard - React 

A comprehensive dental practice management system built with React, Vite, and React Router, featuring role-based authentication, patient management, appointment scheduling, and file upload capabilities.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of practice KPIs, upcoming appointments, and top patients
- **Patient Management**: Add, edit, delete, and view patient records
- **Appointment Management**: Schedule, update, and manage patient appointments
- **Calendar View**: Monthly calendar with appointment visualization
- **File Upload**: Attach documents, images, and invoices to appointments
- **Treatment Tracking**: Record treatments, costs, and follow-up appointments

### Patient Features
- **Personal Dashboard**: View upcoming appointments and treatment history
- **Appointment History**: Access to all past and scheduled appointments
- **Medical Records**: Personal information and complete treatment history
- **File Access**: Download attached documents and treatment files

### Technical Features
- **Role-Based Authentication**: Separate admin and patient portals
- **Data Persistence**: All data stored in localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile
- **File Upload**: Support for PDF, images, and documents (base64 storage)
- **Real-time Updates**: Instant data synchronization across components
- **Client-Side Routing**: Fast navigation with React Router

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Simulated with localStorage
- **File Storage**: Base64 encoding for localStorage
- **Date Handling**: date-fns library
- **Icons**: Lucide React

##  Clone the repository:
git clone <repository-url>

## 🔐 Demo Credentials

### Admin Access
- **Email**: admin@entnt.in
- **Password**: admin123

### Patient Access
- **Email**: john@entnt.in
- **Password**: patient123
- **Alternative**: jane@entnt.in / patient123
- **Alternative**: mike@entnt.in / patient123

## 🏗️ Architecture Decisions

### State Management
- **Context API**: Chosen for its simplicity and built-in React support
- **Separation of Concerns**: Auth and Data contexts kept separate
- **localStorage Integration**: Automatic persistence of all data changes

### Routing
- **React Router v6**: Modern declarative routing with nested routes
- **Protected Routes**: Role-based access control with automatic redirects
- **Layout Routes**: Shared layouts for admin and patient sections

### Authentication
- **Simulated Authentication**: No external auth service required
- **Role-Based Access**: Separate layouts and routes for admin/patient
- **Session Persistence**: User sessions maintained across browser refreshes

### Data Storage
- **localStorage**: All data persisted locally as per requirements
- **JSON Structure**: Normalized data structure for patients and incidents
- **File Storage**: Base64 encoding for file attachments

### Component Architecture
- **Functional Components**: Modern React patterns with hooks
- **Reusable Components**: Modular design for maintainability
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🎯 Key Features Implementation

### File Upload System
- Drag-and-drop interface
- Multiple file type support (PDF, images, documents)
- 5MB file size limit
- Base64 encoding for localStorage compatibility
- File preview and download functionality

### Calendar Integration
- Monthly view with appointment visualization
- Click-to-view appointment details
- Navigation between months
- Responsive design for mobile devices

### Dashboard Analytics
- Real-time KPI calculations
- Patient ranking by spending
- Appointment status tracking
- Revenue calculations

### Form Validation
- React Hook Form with Zod schemas
- Real-time validation feedback
- Type-safe form handling
- Custom validation rules

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## 🔧 Development Notes

### Known Limitations
- File storage limited by localStorage capacity (~5-10MB)
- No real-time collaboration features
- Client-side only data validation
- No server-side persistence

### Future Enhancements
- Real backend integration
- Email notifications
- Advanced reporting features
- Multi-clinic support
- Mobile app development
- Real-time updates with WebSockets

## 📝 Technical Decisions

1. **React + Vite**: Fast development and build times
2. **React Router v6**: Modern routing with better performance
3. **Tailwind CSS**: Utility-first CSS for rapid development
4. **shadcn/ui**: High-quality, accessible component library
5. **Context API**: Lightweight state management solution
6. **React Hook Form**: Performant forms with minimal re-renders
7. **Zod**: Type-safe schema validation
8. **date-fns**: Lightweight date manipulation library
9. **localStorage**: Simple persistence without external dependencies

## 🐛 Known Issues

- Large file uploads may cause performance issues
- Browser localStorage limits may be reached with extensive use
- No data backup/export functionality (except manual export)
- PDF preview not available in all browsers


## 📄 License

This project is developed for ENTNT technical assessment purposes.


## 🙏 Acknowledgments

- Built with React and modern web technologies
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS
