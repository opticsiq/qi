# 🃏 QI Cards - Smart Card Management System

A modern banking card management system with a beautiful user interface and admin panel.

## ✨ Features

- 🎨 Modern and attractive user interface
- 📱 Responsive design for all devices
- 🔐 Password-protected admin panel
- 📊 Comprehensive admin dashboard
- 🖼️ Upload and display card images
- ⚡ Real-time data updates
- 🌐 Free deployment on GitHub Pages
- 🗄️ Free Supabase database

## 🚀 Quick Deployment

### Method 1: GitHub Pages + Supabase (Recommended)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Create `uploads` table with required columns

2. **Upload Project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/card-face.git
   git push -u origin main
   ```

3. **Setup GitHub Secrets**
   - Go to Settings > Secrets and variables > Actions
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Choose "GitHub Actions" as source

### Method 2: Netlify + Supabase

1. Upload project to GitHub
2. Connect project to Netlify
3. Add environment variables in Netlify
4. Deploy automatically

## 🔧 Local Development

### Requirements
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Usage

### For Regular Users
- Go to the main page
- Upload front and back card images
- Click "Update Card"

### For Admin
- Go to `/admin`
- Default password: `admin123`
- Review and manage all uploads

## 🛠️ Technologies Used

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod

## 📁 Project Structure

```
card-face/
├── src/
│   ├── components/     # UI Components
│   ├── pages/         # Application Pages
│   ├── lib/           # Libraries and Services
│   └── hooks/         # React Hooks
├── public/            # Public Files
├── .github/           # GitHub Actions
└── docs/             # Documentation
```

## 🔐 Security

- Password-protected admin panel
- Data encryption in database
- Input validation
- Protection against XSS and CSRF

## 📊 Database

### uploads table
```sql
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_image TEXT NOT NULL,
  back_image TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Deployment

### GitHub Pages
- Automatic deployment on push to main
- URL: `https://username.github.io/card-face/`

### Netlify
- Automatic deployment from GitHub
- Custom domain

### Vercel
- Automatic deployment from GitHub
- High performance

## 🔧 Customization

### Change Admin Password
```typescript
// In src/pages/Admin.tsx
const ADMIN_PASSWORD = 'new_password';
```

### Change Colors
```css
/* In src/index.css */
:root {
  --primary: #FFD600;
  --secondary: #111;
}
```

## 📞 Support

- 📧 Email: support@qicards.iq
- 📱 Phone: 422 (Zain - AsiaCell - Korek)
- 🏢 Address: Karrada Street, Baghdad, Iraq

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the project
2. Create a new branch
3. Make changes
4. Create Pull Request

---

**QI Cards** - Banking Card Protection System Supported by Central Bank of Iraq 