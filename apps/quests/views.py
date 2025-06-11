from rest_framework import viewsets, permissions
from .models import ChoiceNode, UserProgress
from .serializers import ChoiceNodeSerializer, UserProgressSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ChoiceNodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChoiceNode.objects.all()
    serializer_class = ChoiceNodeSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        ノードごとの進行統計API例
        """
        node = self.get_object()
        total = node.userprogress_set.count()
        stats = []
        for next_node in node.next_choices.all():
            count = UserProgress.objects.filter(node=next_node).count()
            stats.append({
                'id': next_node.id,
                'name': next_node.name,
                'count': count,
                'rate': count / total if total else 0,
            })
        return Response(stats)

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
