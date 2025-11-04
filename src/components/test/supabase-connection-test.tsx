'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function SupabaseConnectionTest({ workspaceId }: { workspaceId: string }) {
  const [results, setResults] = useState<unknown>({})
  const [testing, setTesting] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function runTests() {
      const testResults: any = {}

      // Test 1: Database Connection
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('id, name')
          .limit(1)
        
        testResults.database = {
          success: !error && data,
          message: error ? (error as any).message : `Connected! Found ${data?.length || 0} workspaces`,
          data: data
        }
      } catch (err: any) {
        testResults.database = {
          success: false,
          message: (err as Error).message
        }
      }

      // Test 2: Productions Table
      try {
        const { data, error } = await supabase
          .from('productions')
          .select('id, name')
          .eq('workspace_id', workspaceId)
          .limit(5)
        
        testResults.productions = {
          success: !error,
          message: error ? (error as any).message : `Found ${data?.length || 0} productions`,
          data: data
        }
      } catch (err: any) {
        testResults.productions = {
          success: false,
          message: (err as Error).message
        }
      }

      // Test 3: Events Table
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name')
          .eq('workspace_id', workspaceId)
          .limit(5)
        
        testResults.events = {
          success: !error,
          message: error ? (error as any).message : `Found ${data?.length || 0} events`,
          data: data
        }
      } catch (err: any) {
        testResults.events = {
          success: false,
          message: (err as Error).message
        }
      }

      // Test 4: RPC Function
      try {
        const { data, error } = await supabase
          .rpc('get_workspace_dashboard', {
            p_workspace_id: workspaceId
          })
        
        testResults.rpc = {
          success: !error,
          message: error ? (error as any).message : 'Dashboard RPC function works!',
          data: data
        }
      } catch (err: any) {
        testResults.rpc = {
          success: false,
          message: (err as Error).message
        }
      }

      // Test 5: Real-time Connection
      try {
        const channel = supabase
          .channel('test-channel')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'productions'
          }, () => {})
          .subscribe((status) => {
            testResults.realtime = {
              success: status === 'SUBSCRIBED',
              message: status === 'SUBSCRIBED' ? 'Real-time connected!' : `Status: ${status}`
            }
            setResults({...testResults})
          })

        // Give it 2 seconds to connect
        setTimeout(() => {
          supabase.removeChannel(channel)
        }, 2000)
      } catch (err: any) {
        testResults.realtime = {
          success: false,
          message: (err as Error).message
        }
      }

      setResults(testResults)
      setTesting(false)
    }

    runTests()
  }, [workspaceId])

  return (
    <Card className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Testing database, API, and real-time connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {testing && (
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Running tests...</span>
          </div>
        )}

        {Object.entries(results).map(([test, result]: [string, any]) => (
          <div key={test} className="flex items-start gap-3 p-3 border rounded-lg">
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
                <span className="font-medium capitalize">{test.replace('_', ' ')}</span>
                <Badge variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? 'PASS' : 'FAIL'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{result.message}</p>
              {result.data && (
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}

        {!testing && Object.values(results).every((r: any) => r.success) && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ All tests passed! Your backend is fully operational.
            </p>
            <p className="text-sm text-green-700 mt-1">
              You can now start using real data in your application.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
