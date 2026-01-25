import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    name: string;
    revenue: number;
  }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => (
  <Card className="dashboard-card">
    <CardHeader>
      <CardTitle>Revenue by Category</CardTitle>
      <CardDescription>Revenue in thousands (LKR)</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}K`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);