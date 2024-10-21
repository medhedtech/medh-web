import React from 'react'
import OperationalMember from '@/components/sections/dynamic-team/OperationalMember'
import DeveloperTeam from '@/components/sections/dynamic-team/developerTeam';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import AdvisorTeam from '@/components/sections/dynamic-team/advisorTeam';

function DynamicTeam() {
  return (
    <PageWrapper>
      <OperationalMember />
     <DeveloperTeam/>
     <AdvisorTeam/>
    </PageWrapper>
  )
}

export default DynamicTeam
