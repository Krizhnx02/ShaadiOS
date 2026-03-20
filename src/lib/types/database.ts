export interface Database {
  public: {
    Tables: {
      wedding_profiles: {
        Row: {
          id: string;
          user_id: string;
          bride_name: string;
          groom_name: string;
          wedding_date: string;
          venue: string | null;
          city: string | null;
          total_budget: number;
          currency: string;
          perspective: string;
          selected_events: string[];
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bride_name: string;
          groom_name: string;
          wedding_date: string;
          venue?: string | null;
          city?: string | null;
          total_budget?: number;
          currency?: string;
          perspective?: string;
          selected_events?: string[];
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bride_name?: string;
          groom_name?: string;
          wedding_date?: string;
          venue?: string | null;
          city?: string | null;
          total_budget?: number;
          currency?: string;
          perspective?: string;
          selected_events?: string[];
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string | null;
          side: string;
          event: string;
          priority: string;
          status: string;
          assignee: string | null;
          assignee_phone: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description?: string | null;
          side: string;
          event: string;
          priority: string;
          status?: string;
          assignee?: string | null;
          assignee_phone?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          description?: string | null;
          side?: string;
          event?: string;
          priority?: string;
          status?: string;
          assignee?: string | null;
          assignee_phone?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_items: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          category: string;
          side: string;
          event: string;
          estimated_cost: number;
          actual_cost: number | null;
          is_paid: boolean;
          vendor_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          category: string;
          side: string;
          event: string;
          estimated_cost: number;
          actual_cost?: number | null;
          is_paid?: boolean;
          vendor_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          category?: string;
          side?: string;
          event?: string;
          estimated_cost?: number;
          actual_cost?: number | null;
          is_paid?: boolean;
          vendor_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          category: string;
          side: string;
          phone: string | null;
          email: string | null;
          instagram: string | null;
          quoted_price: number | null;
          final_price: number | null;
          is_booked: boolean;
          rating: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          category: string;
          side: string;
          phone?: string | null;
          email?: string | null;
          instagram?: string | null;
          quoted_price?: number | null;
          final_price?: number | null;
          is_booked?: boolean;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          category?: string;
          side?: string;
          phone?: string | null;
          email?: string | null;
          instagram?: string | null;
          quoted_price?: number | null;
          final_price?: number | null;
          is_booked?: boolean;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          side: string;
          phone: string | null;
          email: string | null;
          rsvp_status: string;
          plus_ones: number;
          events: string[];
          table_number: string | null;
          dietary_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          side: string;
          phone?: string | null;
          email?: string | null;
          rsvp_status?: string;
          plus_ones?: number;
          events?: string[];
          table_number?: string | null;
          dietary_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          side?: string;
          phone?: string | null;
          email?: string | null;
          rsvp_status?: string;
          plus_ones?: number;
          events?: string[];
          table_number?: string | null;
          dietary_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type WeddingProfileRow = Database["public"]["Tables"]["wedding_profiles"]["Row"];
export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type BudgetItemRow = Database["public"]["Tables"]["budget_items"]["Row"];
export type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];
export type GuestRow = Database["public"]["Tables"]["guests"]["Row"];
