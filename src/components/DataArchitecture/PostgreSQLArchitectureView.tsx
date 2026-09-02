import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Code, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  ShieldCheck, 
  HardDrive, 
  Binary, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { POSTGRES_TABLE_SCHEMAS, POSTGRES_DDL_MIGRATION } from '../../lib/dbSchema';
import { PostgresTableMeta, UserProfile, PurposeOfUse } from '../../types';

interface PostgreSQLArchitectureViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
}

export const PostgreSQLArchitectureView: React.FC<PostgreSQLArchitectureViewProps> = ({
  currentUser,
  purposeOfUse,
}) => {
  const [selectedTable, setSelectedTable] = useState<PostgresTableMeta>(POSTGRES_TABLE_SCHEMAS[0]);
  const [activeTab, setActiveTab] = useState<'SCHEMAS' | 'DDL' | 'AWS_RDS'>('SCHEMAS');
  const [copied, setCopied] = useState(false);

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(POSTGRES_DDL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalRows = POSTGRES_TABLE_SCHEMAS.reduce((acc, t) => acc + t.rowCount, 0);
  const totalSizeKb = POSTGRES_TABLE_SCHEMAS.reduce((acc, t) => acc + t.sizeKb, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Enterprise PostgreSQL & Vector Data Layer</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                AWS RDS PostgreSQL / pgvector Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Durable relational storage with schema validation: Clinical FHIR entities, RAG chunk embeddings, immutable execution audit logs, and self-improving proposal ledger.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs text-slate-300">
              <div>Tables: <strong className="text-white">{POSTGRES_TABLE_SCHEMAS.length} active</strong></div>
              <div>Records: <strong className="text-emerald-300">{totalRows} rows</strong> ({totalSizeKb} KB)</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('SCHEMAS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'SCHEMAS'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table Schema Inspector
          </button>

          <button
            onClick={() => setActiveTab('DDL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'DDL'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            PostgreSQL DDL Migration SQL
          </button>

          <button
            onClick={() => setActiveTab('AWS_RDS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'AWS_RDS'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            AWS Deployment Architecture
          </button>
        </div>
      </div>

      {activeTab === 'SCHEMAS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Registered PostgreSQL Tables ({POSTGRES_TABLE_SCHEMAS.length})
            </span>
            {POSTGRES_TABLE_SCHEMAS.map((tbl) => {
              const isSelected = selectedTable.tableName === tbl.tableName;
              return (
                <button
                  key={tbl.tableName}
                  onClick={() => setSelectedTable(tbl)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold font-mono text-white">{tbl.tableName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{tbl.description}</div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span className="text-emerald-300 font-bold">{tbl.rowCount} rows</span>
                    <div className="text-slate-400">{tbl.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Table Inspector (8 cols) */}
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold font-mono text-white">{selectedTable.tableName}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    Category: {selectedTable.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{selectedTable.description}</p>
              </div>

              <div className="text-right font-mono text-xs text-slate-300">
                <div>Total Rows: <strong className="text-emerald-300">{selectedTable.rowCount}</strong></div>
                <div>Storage Size: <strong className="text-white">{selectedTable.sizeKb} KB</strong></div>
              </div>
            </div>

            {/* Column Schema Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Data Type</th>
                    <th className="py-2.5 px-3">Constraints</th>
                    <th className="py-2.5 px-3">Nullable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        {col.isPrimary && <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">PK</span>}
                        {col.isForeign && <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">FK</span>}
                        {col.name}
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300">{col.type}</td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {col.isPrimary ? 'PRIMARY KEY' : col.isForeign ? 'FOREIGN KEY REFERENCES' : 'INDEXED'}
                      </td>
                      <td className="py-2.5 px-3">
                        {col.nullable ? (
                          <span className="text-slate-500">NULL</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">NOT NULL</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DDL' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">PostgreSQL & pgvector DDL Migration Script</h2>
            </div>
            <button
              onClick={handleCopyDDL}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied DDL!' : 'Copy SQL'}
            </button>
          </div>

          <pre className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {POSTGRES_DDL_MIGRATION}
          </pre>
        </div>
      )}

      {activeTab === 'AWS_RDS' && (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">AWS Deployment Architecture Compatibility</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Database className="w-4 h-4 text-emerald-400" />
                Amazon Aurora PostgreSQL
              </div>
              <p className="text-xs text-slate-300">
                Serverless v2 with pgvector extension enabled for multi-region vector indexing and sub-millisecond retrieval.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                AWS KMS & HIPAA VPC
              </div>
              <p className="text-xs text-slate-300">
                AES-256 envelope encryption at rest, private subnets, and IAM role-based authentication without hardcoded DB secrets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-purple-400" />
                ECS Fargate / App Runner
              </div>
              <p className="text-xs text-slate-300">
                Stateless Node.js/Express container backend with connection pooling via AWS RDS Proxy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
