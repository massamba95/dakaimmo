"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Home,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";

interface Stats {
  totalOrgs: number;
  activeOrgs: number;
  trialOrgs: number;
  blockedOrgs: number;
  cancelledOrgs: number;
  totalMembers: number;
  totalProperties: number;
  monthlyRevenue: number;
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Erreur de chargement des statistiques.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Organisations",
      value: stats.totalOrgs,
      icon: Building2,
      description: `${stats.activeOrgs} actives · ${stats.trialOrgs} essai`,
    },
    {
      title: "Utilisateurs actifs",
      value: stats.totalMembers,
      icon: Users,
      description: "Membres avec statut ACTIVE",
    },
    {
      title: "Biens immobiliers",
      value: stats.totalProperties,
      icon: Home,
      description: "Sur toutes les organisations",
    },
    {
      title: "Revenu mensuel",
      value: `${stats.monthlyRevenue.toLocaleString("fr-FR")} FCFA`,
      icon: CreditCard,
      description: "Abonnements actifs",
    },
  ];

  const statusCards = [
    { label: "Actives", count: stats.activeOrgs, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Essai", count: stats.trialOrgs, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Bloquées", count: stats.blockedOrgs, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Annulées", count: stats.cancelledOrgs, icon: XCircle, color: "text-gray-500", bg: "bg-gray-50" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Vue globale</h1>
      <p className="text-muted-foreground mt-1">Tableau de bord super administrateur.</p>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Répartition par statut */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Répartition des organisations</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${s.bg} mb-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Indicateurs */}
      {stats.blockedOrgs > 0 && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">
            <strong>{stats.blockedOrgs} organisation{stats.blockedOrgs > 1 ? "s" : ""} bloquée{stats.blockedOrgs > 1 ? "s" : ""}</strong> — vérifiez la section Organisations.
          </p>
        </div>
      )}

      {stats.totalOrgs === 0 && (
        <div className="mt-8">
          <Badge variant="outline">Aucune organisation enregistrée</Badge>
        </div>
      )}
    </div>
  );
}
