// src/app/experiment/page.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function Experiment() {
  const [prompt, setPrompt] = useState('');
  const [variation, setVariation] = useState('');
  const [aiResponse1, setAiResponse1] = useState('');
  const [aiResponse2, setAiResponse2] = useState('');
  const [evaluation1, setEvaluation1] = useState('');
  const [evaluation2, setEvaluation2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleExperiment = async () => {
    setLoading(true);
    setErrorMessage('');
    setAiResponse1('');
    setAiResponse2('');
    setEvaluation1('');
    setEvaluation2('');

    try {
      // Generate AI response for the original prompt
      const response1 = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      }).then((res) => res.json());

      // Generate AI response for the variation
      const response2 = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: variation }),
      }).then((res) => res.json());

      setAiResponse1(response1.response);
      setAiResponse2(response2.response);

      // Evaluate the AI responses
      const eval1 = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt, aiResponse: response1.response }),
      }).then((res) => res.json());

      const eval2 = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: variation, aiResponse: response2.response }),
      }).then((res) => res.json());

      setEvaluation1(eval1.evaluation);
      setEvaluation2(eval2.evaluation);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while running the experiment.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Interactive Experiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="original-prompt">Original Prompt</Label>
                <Textarea
                  id="original-prompt"
                  placeholder="Enter your original prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="variation-prompt">Variation Prompt</Label>
                <Textarea
                  id="variation-prompt"
                  placeholder="Enter your variation prompt here..."
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                />
              </div>
              <Button onClick={handleExperiment} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Experiment...
                  </>
                ) : (
                  'Run Experiment'
                )}
              </Button>
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {aiResponse1 && aiResponse2 && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-semibold">Original Prompt Response:</Label>
                    <p className="bg-gray-100 p-4 rounded-md">{aiResponse1}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Variation Prompt Response:</Label>
                    <p className="bg-gray-100 p-4 rounded-md">{aiResponse2}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-semibold">Original Prompt Evaluation:</Label>
                    <p className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
                      {evaluation1}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Variation Prompt Evaluation:</Label>
                    <p className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
                      {evaluation2}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}