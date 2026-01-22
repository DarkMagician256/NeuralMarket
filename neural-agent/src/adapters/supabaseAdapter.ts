/**
 * Supabase Database Adapter for ElizaOS
 * 
 * Provides persistent storage for the Neural Agent using Supabase
 * instead of the mock in-memory adapter.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IDatabaseAdapter, Memory, Goal, Actor, Relationship, UUID } from '@elizaos/core';

export class SupabaseDatabaseAdapter {
    private supabase: SupabaseClient;
    public db: SupabaseClient;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.db = this.supabase;
    }

    async init(): Promise<void> {
        // Supabase is already initialized
        console.log('[SupabaseAdapter] Connected to Supabase');
    }

    async close(): Promise<void> {
        // Supabase client doesn't need explicit closing
    }

    async getAccountById(userId: UUID): Promise<any | null> {
        const { data, error } = await this.supabase
            .from('agent_accounts')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data;
    }

    async createAccount(account: any): Promise<boolean> {
        const { error } = await this.supabase
            .from('agent_accounts')
            .insert(account);

        return !error;
    }

    async getMemories(params: {
        roomId: UUID;
        count?: number;
        unique?: boolean;
        tableName: string;
    }): Promise<Memory[]> {
        let query = this.supabase
            .from('agent_memories')
            .select('*')
            .eq('room_id', params.roomId)
            .order('created_at', { ascending: false });

        if (params.count) {
            query = query.limit(params.count);
        }

        const { data, error } = await query;
        if (error) return [];

        return data.map(this.mapToMemory);
    }

    async createMemory(memory: Memory, tableName: string): Promise<void> {
        await this.supabase.from('agent_memories').insert({
            id: memory.id,
            user_id: memory.userId,
            agent_id: memory.agentId,
            room_id: memory.roomId,
            content: memory.content,
            embedding: memory.embedding,
            created_at: new Date().toISOString(),
        });
    }

    async searchMemories(params: {
        tableName: string;
        roomId: UUID;
        embedding: number[];
        match_threshold: number;
        match_count: number;
        unique: boolean;
    }): Promise<Memory[]> {
        // For now, return recent memories without vector search
        // Vector search would require pgvector extension in Supabase
        return this.getMemories({
            roomId: params.roomId,
            count: params.match_count,
            tableName: params.tableName,
        });
    }

    async getCachedEmbeddings(opts: {
        query_table_name: string;
        query_threshold: number;
        query_input: string;
        query_field_name: string;
        query_field_sub_name: string;
        query_match_count: number;
    }): Promise<any[]> {
        return [];
    }

    async removeAllMemories(roomId: UUID, tableName: string): Promise<void> {
        await this.supabase
            .from('agent_memories')
            .delete()
            .eq('room_id', roomId);
    }

    async countMemories(roomId: UUID, unique?: boolean, tableName?: string): Promise<number> {
        const { count } = await this.supabase
            .from('agent_memories')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', roomId);

        return count || 0;
    }

    async getGoals(params: {
        roomId: UUID;
        userId?: UUID | null;
        onlyInProgress?: boolean;
        count?: number;
    }): Promise<Goal[]> {
        let query = this.supabase
            .from('agent_goals')
            .select('*')
            .eq('room_id', params.roomId);

        if (params.userId) {
            query = query.eq('user_id', params.userId);
        }
        if (params.onlyInProgress) {
            query = query.eq('status', 'IN_PROGRESS');
        }
        if (params.count) {
            query = query.limit(params.count);
        }

        const { data } = await query;
        return (data || []) as Goal[];
    }

    async createGoal(goal: Goal): Promise<void> {
        await this.supabase.from('agent_goals').insert(goal);
    }

    async updateGoalStatus(params: { goalId: UUID; status: string }): Promise<void> {
        await this.supabase
            .from('agent_goals')
            .update({ status: params.status })
            .eq('id', params.goalId);
    }

    async removeGoal(goalId: UUID): Promise<void> {
        await this.supabase.from('agent_goals').delete().eq('id', goalId);
    }

    async log(params: { body: any; userId: UUID; roomId: UUID; type: string }): Promise<void> {
        await this.supabase.from('agent_logs').insert({
            user_id: params.userId,
            room_id: params.roomId,
            type: params.type,
            body: params.body,
            created_at: new Date().toISOString(),
        });
    }

    async getActorDetails(params: { roomId: UUID }): Promise<Actor[]> {
        return [];
    }

    async createRoom(roomId?: UUID): Promise<UUID> {
        const id = roomId || crypto.randomUUID();
        await this.supabase.from('agent_rooms').insert({ id });
        return id;
    }

    async getRoom(roomId: UUID): Promise<UUID | null> {
        const { data } = await this.supabase
            .from('agent_rooms')
            .select('id')
            .eq('id', roomId)
            .single();

        return data?.id || null;
    }

    async getRoomsForParticipant(userId: UUID): Promise<UUID[]> {
        return [];
    }

    async getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]> {
        return [];
    }

    async getParticipantsForAccount(userId: UUID): Promise<any[]> {
        return [];
    }

    async getParticipantsForRoom(roomId: UUID): Promise<UUID[]> {
        return [];
    }

    async getParticipantUserState(roomId: UUID, userId: UUID): Promise<"FOLLOWED" | "MUTED" | null> {
        return null;
    }

    async setParticipantUserState(roomId: UUID, oderId: UUID, state: string | null): Promise<void> {
        // Not implemented
    }

    async createRelationship(params: { userA: UUID; userB: UUID }): Promise<boolean> {
        return true;
    }

    async getRelationship(params: { userA: UUID; userB: UUID }): Promise<Relationship | null> {
        return null;
    }

    async getRelationships(params: { userId: UUID }): Promise<Relationship[]> {
        return [];
    }

    private mapToMemory(data: any): Memory {
        return {
            id: data.id,
            userId: data.user_id,
            agentId: data.agent_id,
            roomId: data.room_id,
            content: data.content,
            embedding: data.embedding,
            createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
        };
    }
}

// Factory function
export function createSupabaseAdapter(
    supabaseUrl?: string,
    supabaseKey?: string
): SupabaseDatabaseAdapter | null {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
        console.warn('[SupabaseAdapter] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Using mock adapter.');
        return null;
    }

    return new SupabaseDatabaseAdapter(url, key);
}
