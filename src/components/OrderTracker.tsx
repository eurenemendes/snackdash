'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, ChefHat, Truck, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

const orderSteps = [
  { name: 'Pedido Recebido', icon: ClipboardCheck },
  { name: 'Em Preparo', icon: ChefHat },
  { name: 'Saiu para Entrega', icon: Truck },
  { name: 'Entregue', icon: PartyPopper },
];

export default function OrderTracker() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < orderSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 5000); // Advances every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentStep]);
  
  const progressPercentage = (currentStep / (orderSteps.length - 1)) * 100;
  const currentStepData = orderSteps[currentStep];

  if (!currentStepData) {
    // Return null or a loading state if the step is invalid
    return null;
  }

  return (
    <div className="w-full">
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2" />
        <div className="absolute left-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
        <div className="relative flex justify-between">
          {orderSteps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors duration-500',
                  index <= currentStep ? 'border-primary' : 'border-border'
                )}
              >
                <step.icon
                  className={cn(
                    'h-5 w-5 transition-colors duration-500',
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center'>
        <p className="text-lg font-semibold">{currentStepData.name}</p>
        <p className="text-sm text-muted-foreground">
            {currentStep === orderSteps.length - 1 ? 'Bom apetite!' : 'Estamos preparando tudo com carinho.'}
        </p>
      </div>
      <Progress value={progressPercentage} className="mt-4 h-2" />
    </div>
  );
}
