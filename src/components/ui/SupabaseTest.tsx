import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './button';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      console.log('🔍 Testing Supabase connection...');
      console.log('🔍 URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔍 Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('🔍 Supabase connection error:', error);
        setTestResult(`Connection failed: ${error.message}`);
      } else {
        console.log('🔍 Supabase connection successful:', data);
        setTestResult('✅ Supabase connection successful!');
      }
    } catch (error) {
      console.error('🔍 Test error:', error);
      setTestResult(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Test</h3>
      <Button 
        onClick={testSupabaseConnection} 
        disabled={isLoading}
        className="mb-2"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </Button>
      {testResult && (
        <div className={`p-2 rounded text-sm ${
          testResult.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 