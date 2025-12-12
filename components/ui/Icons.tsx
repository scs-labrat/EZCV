import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  ChevronRight, 
  ChevronDown,
  Save, 
  Download, 
  Layout, 
  PenTool, 
  Check, 
  X,
  History,
  Wand2,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
  Linkedin,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Grid,
  FileCode
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number;
}

export const IconSparkles = ({ className, size = 16 }: IconProps) => <Sparkles className={className} size={size} />;
export const IconFile = ({ className, size = 18 }: IconProps) => <FileText className={className} size={size} />;
export const IconBriefcase = ({ className, size = 18 }: IconProps) => <Briefcase className={className} size={size} />;
export const IconChevronRight = ({ className, size = 16 }: IconProps) => <ChevronRight className={className} size={size} />;
export const IconChevronDown = ({ className, size = 16 }: IconProps) => <ChevronDown className={className} size={size} />;
export const IconSave = ({ className, size = 16 }: IconProps) => <Save className={className} size={size} />;
export const IconDownload = ({ className, size = 16 }: IconProps) => <Download className={className} size={size} />;
export const IconLayout = ({ className, size = 18 }: IconProps) => <Layout className={className} size={size} />;
export const IconPen = ({ className, size = 16 }: IconProps) => <PenTool className={className} size={size} />;
export const IconCheck = ({ className, size = 16 }: IconProps) => <Check className={className} size={size} />;
export const IconX = ({ className, size = 16 }: IconProps) => <X className={className} size={size} />;
export const IconHistory = ({ className, size = 14 }: IconProps) => <History className={className} size={size} />;
export const IconMagic = ({ className, size = 14 }: IconProps) => <Wand2 className={className} size={size} />;
export const IconMore = ({ className, size = 16 }: IconProps) => <MoreHorizontal className={className} size={size} />;
export const IconPlus = ({ className, size = 16 }: IconProps) => <Plus className={className} size={size} />;
export const IconTrash = ({ className, size = 16 }: IconProps) => <Trash2 className={className} size={size} />;
export const IconUpload = ({ className, size = 16 }: IconProps) => <Upload className={className} size={size} />;
export const IconLinkedin = ({ className, size = 16 }: IconProps) => <Linkedin className={className} size={size} />;
export const IconUndo = ({ className, size = 16 }: IconProps) => <Undo className={className} size={size} />;
export const IconRedo = ({ className, size = 16 }: IconProps) => <Redo className={className} size={size} />;
export const IconMaximize = ({ className, size = 16 }: IconProps) => <Maximize2 className={className} size={size} />;
export const IconMinimize = ({ className, size = 16 }: IconProps) => <Minimize2 className={className} size={size} />;
export const IconGrid = ({ className, size = 16 }: IconProps) => <Grid className={className} size={size} />;
export const IconFileCode = ({ className, size = 16 }: IconProps) => <FileCode className={className} size={size} />;
