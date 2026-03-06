import { Layout } from "@/components/layouts/Layout"
import { Code } from "lucide-react"

export default function SystemCodePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full">
            <Code className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold">System Code</h1>
        </div>
      </div>
    </Layout>
  )
}
