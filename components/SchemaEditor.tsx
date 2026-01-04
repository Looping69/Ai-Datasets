
import React, { useState, useEffect } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CopyIcon } from './icons/CopyIcon';
import Tooltip from './Tooltip';
import TooltipWrapper from './TooltipWrapper';

type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';

interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
}

interface SchemaEditorProps {
  initialJsonString: string;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ initialJsonString }) => {
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const schemaObj = JSON.parse(initialJsonString);
      if (typeof schemaObj !== 'object' || schemaObj === null) {
        throw new Error('Invalid schema format');
      }
      const initialFields = Object.entries(schemaObj).map(([name, type], index) => ({
        id: `field-${index}-${Date.now()}`,
        name,
        type: type as FieldType,
      }));
      setFields(initialFields);
    } catch (e) {
      console.error("Failed to parse initial schema JSON:", e);
      setFields([]);
    }
  }, [initialJsonString]);

  const handleFieldChange = (id: string, key: 'name' | 'type', value: string) => {
    setFields(currentFields =>
      currentFields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const addField = () => {
    const newField: SchemaField = {
      id: `field-new-${Date.now()}`,
      name: 'new_field',
      type: 'string',
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleCopy = () => {
    const schemaJson = fields.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name.trim()] = field.type;
      }
      return acc;
    }, {} as Record<string, FieldType>);

    navigator.clipboard.writeText(JSON.stringify(schemaJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-dim)] p-6"
      style={{ clipPath: 'var(--clip-panel-sm)' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="hud-label text-[var(--text-normal)]">SCHEMA</span>
          <span className="hud-label text-[var(--text-muted)]">[{fields.length} FIELDS]</span>
        </div>
        <TooltipWrapper tooltipText="Copy schema as JSON.">
          <button
            onClick={handleCopy}
            className="hud-button py-1.5 px-4 text-xs"
          >
            <span className="flex items-center gap-2">
              <CopyIcon className="h-3.5 w-3.5" />
              {copied ? 'COPIED' : 'COPY'}
            </span>
          </button>
        </TooltipWrapper>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 bg-[var(--bg-void)] p-3 group border border-[var(--border-dim)]"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            {/* Index */}
            <span className="hud-label text-[var(--text-muted)] w-6">{(index + 1).toString().padStart(2, '0')}</span>

            {/* Field Name */}
            <input
              type="text"
              value={field.name}
              onChange={e => handleFieldChange(field.id, 'name', e.target.value)}
              placeholder="field_name"
              className="flex-1 bg-transparent border-none outline-none text-[var(--cyan-bright)] font-mono text-sm placeholder-[var(--text-muted)]"
            />

            <span className="text-[var(--text-muted)]">:</span>

            {/* Field Type */}
            <select
              value={field.type}
              onChange={e => handleFieldChange(field.id, 'type', e.target.value)}
              className="bg-[var(--bg-panel)] border border-[var(--border-dim)] text-[var(--text-normal)] text-sm py-1 px-3 outline-none cursor-pointer focus:border-[var(--cyan-primary)]"
            >
              <option value="string">STRING</option>
              <option value="number">NUMBER</option>
              <option value="boolean">BOOLEAN</option>
              <option value="object">OBJECT</option>
              <option value="array">ARRAY</option>
              <option value="date">DATE</option>
            </select>

            {/* Delete Button */}
            <button
              onClick={() => removeField(field.id)}
              className="text-[var(--text-muted)] hover:text-[var(--red-error)] transition-colors p-1 opacity-0 group-hover:opacity-100"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addField}
        className="mt-4 w-full py-3 border border-dashed border-[var(--border-dim)] text-[var(--text-muted)] text-sm font-medium hover:border-[var(--cyan-primary)] hover:text-[var(--cyan-primary)] transition-all flex items-center justify-center gap-2"
        style={{ clipPath: 'var(--clip-panel-sm)' }}
      >
        <PlusIcon className="h-4 w-4" />
        ADD FIELD
      </button>
    </div>
  );
};
