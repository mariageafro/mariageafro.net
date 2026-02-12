import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Image, MessageSquare, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  prestataireId: string;
}

export function DashboardStats({ prestataireId }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    avgNote: 0,
    totalAvis: 0,
    totalPhotos: 0,
    totalVideos: 0,
    ranking: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [avisRes, mediasRes, prestRes] = await Promise.all([
        supabase.from('avis').select('note').eq('prestataire_id', prestataireId).eq('approved', true),
        supabase.from('medias').select('type').eq('prestataire_id', prestataireId),
        supabase.from('prestataires').select('score_ranking').eq('id', prestataireId).maybeSingle(),
      ]);

      const notes = avisRes.data ?? [];
      const medias = mediasRes.data ?? [];
      const avg = notes.length > 0 ? notes.reduce((s, a) => s + a.note, 0) / notes.length : 0;

      setStats({
        avgNote: Math.round(avg * 10) / 10,
        totalAvis: notes.length,
        totalPhotos: medias.filter(m => m.type === 'photo').length,
        totalVideos: medias.filter(m => m.type === 'video').length,
        ranking: prestRes.data?.score_ranking ?? 0,
      });
    };
    fetchStats();
  }, [prestataireId]);

  const cards = [
    { title: 'Note moyenne', value: stats.avgNote > 0 ? `${stats.avgNote}/5` : '—', icon: Star, desc: `${stats.totalAvis} avis` },
    { title: 'Photos', value: stats.totalPhotos, icon: Image, desc: 'publiées' },
    { title: 'Vidéos', value: stats.totalVideos, icon: Image, desc: 'publiées' },
    { title: 'Score ranking', value: Math.round(stats.ranking), icon: TrendingUp, desc: 'points' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <Card key={c.title} className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            <c.icon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-semibold">{c.value}</div>
            <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
