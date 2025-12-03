import { useQuery } from "@tanstack/react-query";
import { fetchFlashcardGroups } from "@/lib/api";
import { GroupCard } from "@/components/GroupCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, GraduationCap, Target, MessageSquare } from "lucide-react";

const Index = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["flashcard-groups"],
    queryFn: fetchFlashcardGroups,
  });

  const groupedByType = groups?.reduce((acc, group) => {
    if (!acc[group.type]) acc[group.type] = [];
    acc[group.type].push(group);
    return acc;
  }, {} as Record<string, typeof groups>);

  const typeConfig = {
    CEFR: { title: "CEFR Levels", icon: GraduationCap, color: "text-primary" },
    COMMON: { title: "Common Vocabulary", icon: BookOpen, color: "text-success" },
    IELTS: { title: "IELTS Preparation", icon: Target, color: "text-accent" },
    TOEIC: { title: "TOEIC Vocabulary", icon: Target, color: "text-destructive" },
    TOPIC: { title: "Topics", icon: MessageSquare, color: "text-muted-foreground" },
  };

  return (
    <div className="min-h-screen bg-[hsl(195,100%,95%)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary to-accent py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              UTC - English
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Học tiếng Anh với flashcards tương tác và trò chơi hấp dẫn. Bắt đầu hành trình của bạn ngay hôm nay!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-40" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(typeConfig).map(([type, config]) => {
              const typeGroups = groupedByType?.[type]?.filter(g => g.flashcardCount > 0);
              if (!typeGroups || typeGroups.length === 0) return null;

              const Icon = config.icon;
              return (
                <section key={type}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                    <h2 className="text-2xl font-bold">{config.title}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({typeGroups.length} {typeGroups.length === 1 ? 'set' : 'sets'})
                    </span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {typeGroups.map((group) => (
                      <GroupCard key={group.id} group={group} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
