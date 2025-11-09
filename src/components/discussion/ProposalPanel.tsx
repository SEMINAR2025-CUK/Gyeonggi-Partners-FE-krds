import { Button } from '@krds-ui/core';
import { Plus, FileText } from 'lucide-react';
import { Proposal } from '../../types/discussion';

interface ProposalPanelProps {
  proposal?: Proposal;
  onCreateProposal: () => void;
}

export const ProposalPanel = ({ proposal, onCreateProposal }: ProposalPanelProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      PENDING_CONSENT: { label: '동의 대기중', color: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: '승인됨', color: 'bg-green-100 text-green-800' },
      REJECTED: { label: '거부됨', color: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 border-l border-gray-200 p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="mb-4">제안서 관리</h2>
        
        <Button
          className="w-full gap-2"
          onClick={onCreateProposal}
          children={
            <>
              <Plus size={16} />
              새 제안서 작성
            </>}
        >
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm mb-3 text-gray-700">제안서 목록</h3>
        
        {proposal ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-blue-600 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm mb-2 truncate">
                  {proposal.title || `제안서 #${proposal.proposalId}`}
                </h4>
                <div className="mb-2">
                  {getStatusBadge(proposal.status)}
                </div>
                <p className="text-xs text-gray-500">
                  ID: {proposal.proposalId}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">작성된 제안서가 없습니다</p>
            <p className="text-xs mt-1">새 제안서를 작성해보세요</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm mb-2 text-blue-900">제안서 안내</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            논의 결과를 바탕으로 제안서를 작성하고 지역 주민들의 동의를 받을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
