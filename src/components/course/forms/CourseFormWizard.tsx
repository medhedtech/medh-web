import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// TODO: Import field/step components for each course type
// import BlendedSteps from './BlendedSteps';
// import LiveSteps from './LiveSteps';
// import FreeSteps from './FreeSteps';

interface CourseFormWizardProps {
  mode: 'create' | 'edit';
  courseType: 'blended' | 'live' | 'free';
  initialValues?: any;
  onSubmit: (data: any) => void;
  lockedFields?: string[];
}

const schemas: Record<string, yup.AnyObjectSchema> = {
  blended: yup.object({ /* ...blended schema... */ }),
  live: yup.object({ /* ...live schema... */ }),
  free: yup.object({ /* ...free schema... */ })
};

export const CourseFormWizard: React.FC<CourseFormWizardProps> = ({
  mode,
  courseType,
  initialValues,
  onSubmit,
  lockedFields = [],
}) => {
  // Pick the correct schema
  const schema = schemas[courseType];
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      methods.reset(initialValues);
    }
  }, [mode, initialValues, methods]);

  // TODO: Render the correct stepper/fields for the course type
  // let StepsComponent = null;
  // if (courseType === 'blended') StepsComponent = <BlendedSteps ... />;
  // else if (courseType === 'live') StepsComponent = <LiveSteps ... />;
  // else if (courseType === 'free') StepsComponent = <FreeSteps ... />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Render stepper and fields here based on courseType */}
        {/* {StepsComponent} */}
        {/* Example: <Stepper steps={...} currentStep={...} /> */}
        {/* Example: <CourseFields lockedFields={lockedFields} /> */}
        <button type="submit" className="btn btn-primary">
          {mode === 'edit' ? 'Update Course' : 'Create Course'}
        </button>
      </form>
    </FormProvider>
  );
};

export default CourseFormWizard; 