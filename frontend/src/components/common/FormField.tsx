import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  register?: UseFormRegister<any>;
  error?: FieldError;
  helper?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  helper,
  required,
  options,
  value,
  onChange,
  disabled,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          {...(register && register(name))}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
      ) : type === 'select' && options ? (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...(register && register(name))}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />
      )}
      
      {helper && !error && (
        <p className="text-sm text-muted-foreground">{helper}</p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
};
