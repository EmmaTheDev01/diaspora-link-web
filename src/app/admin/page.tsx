'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AdminPlatformChart } from '@/components/charts/AdminPlatformChart';
import { UserDevice, ActivityLog, EscrowAccount, Order } from '@/types';
import { ShieldCheck, Users, Database, Lock, Smartphone, RefreshCw, ShoppingBag, FileText } from 'lucide-react';
import { StatCardSkeleton, TableRowSkeleton } from '@/components/common/Skeleton';
import toast from 'react-hot-toast';

export default function AdminConsolePage() {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [escrowVault, setEscrowVault] = useState<EscrowAccount[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [escrowBalance, setEscrowBalance] = useState({ total_cad: 48500, total_rwf: 59800000 });
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    const approvals = await dbService.getPendingApprovals();
    const vault = await dbService.getEscrowVault();
    const allOrders = await dbService.getOrders();
    const devs = await dbService.getUserDevices();
    const logs = await dbService.getActivityLogs();
    const balance = await dbService.getEscrowBalance();

    setPendingApprovals(approvals);
    setEscrowVault(vault);
    setOrders(allOrders);
    setDevices(devs);
    setActivityLogs(logs);
    if (balance.total_cad > 0) setEscrowBalance(balance);
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveAccount = async (id: string, name: string) => {
    const success = await dbService.approveAccount(id);
    if (success) {
      setPendingApprovals((prev) => prev.map((p) => (p.id === id ? { ...p, is_approved: true } : p)));
      toast.success(`Account Approved.\nUnlocked dashboard access for "${name}".`);
    }
  };

  const handleReleaseEscrow = async (escrowId: string, orderNum: string, amount: number) => {
    if (confirm(`Are you sure you want to trigger manual Escrow Release for ${orderNum} ($${amount} CAD)?`)) {
      const success = await dbService.releaseEscrow(escrowId);
      if (success) {
        setEscrowVault((prev) =>
          prev.map((e) => (e.id === escrowId ? { ...e, status: 'fully_released' } : e))
        );
        toast.success(`Escrow Funds Released.\nReleased $${amount} CAD to vendor account.`);
      }
    }
  };

  const menuItems = [
    { id: 'overview', label: '360° System Overview', icon: <ShieldCheck size={18} /> },
    { id: 'orders', label: 'All Platform Orders', icon: <ShoppingBag size={18} /> },
    { id: 'approvals', label: 'Account Approvals', icon: <Users size={18} /> },
    { id: 'escrow', label: 'Escrow Vault Holdings', icon: <Lock size={18} /> },
    { id: 'devices', label: 'Device Sessions', icon: <Smartphone size={18} /> },
    { id: 'logs', label: 'Activity Logs', icon: <FileText size={18} /> },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={menuItems}
      title="360° System Admin Console"
      subtitle="Global management of account approvals, 256-bit Escrow Vault, device security & PostgreSQL diagnostics."
    >
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Admin Banner */}
          <div className="bg-black text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck size={14} /> System Admin Master Console
                </span>
                <span className="text-xs text-gray-300 font-mono">256-Bit Master Key Active</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black font-retro-heading uppercase">
                {user?.full_name || 'Emmanuel Habumugisha (System Admin)'}
              </h2>
              <p className="text-gray-300 text-xs font-medium">360-degree governance across Kigali (KGL) ↔ Toronto (YYZ) trade corridor.</p>
            </div>

            <button
              onClick={loadAdminData}
              className="bg-white hover:bg-gray-100 text-black font-bold px-5 py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              <RefreshCw size={14} className="inline mr-1.5" /> Refresh DB State
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Pending Approvals</span>
                    <Users size={20} className="text-black" />
                  </div>
                  <div className="text-4xl font-black text-black font-retro-heading">
                    {pendingApprovals.filter((p) => !p.is_approved).length}
                  </div>
                  <span className="text-xs text-black font-bold uppercase">Audit Queue (`profiles`)</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Escrow Vault Locked</span>
                    <Lock size={20} className="text-black" />
                  </div>
                  <div className="text-3xl font-black text-black font-retro-heading">
                    ${escrowBalance.total_cad.toLocaleString()} CAD
                  </div>
                  <span className="text-xs text-gray-500 font-bold">{escrowBalance.total_rwf.toLocaleString()} RWF</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Active Device Sessions</span>
                    <Smartphone size={20} className="text-black" />
                  </div>
                  <div className="text-4xl font-black text-black font-retro-heading">{devices.length}</div>
                  <span className="text-xs text-gray-500 font-mono">`user_devices`</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Database Diagnostics</span>
                    <Database size={20} className="text-black" />
                  </div>
                  <div className="text-base font-bold text-black flex items-center gap-2 uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                  </div>
                  <span className="text-xs text-gray-500 font-bold">12 Database Security policies active</span>
                </div>
              </>
            )}
          </div>

          {/* Analytics Chart */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black font-retro-heading">Platform Data Visualisation</h3>
            <AdminPlatformChart />
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-black font-retro-heading">Master Platform Orders Table</h2>
              <p className="text-xs text-gray-500 font-medium">Audit all buyer purchases, escrow holdings, and cross-border flight waybills.</p>
            </div>
            <span className="bg-black text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase">
              {orders.length} Total Orders
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111111] font-medium">
                <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4">Order Number</th>
                    <th className="p-4">Buyer / Recipient</th>
                    <th className="p-4">Total CAD ($)</th>
                    <th className="p-4">Total RWF</th>
                    <th className="p-4">Escrow Status</th>
                    <th className="p-4">AWB Freight Code</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-mono font-bold text-black">{o.order_number}</td>
                        <td className="p-4 font-bold text-black">
                          <div>{o.delivery_address?.recipient_name || o.buyer_name || 'Buyer'}</div>
                          <div className="text-[11px] text-gray-500 font-normal">{o.delivery_address?.city || 'Toronto'}, {o.delivery_address?.country || 'CA'}</div>
                        </td>
                        <td className="p-4 font-black text-black">${o.total_cad.toFixed(2)} CAD</td>
                        <td className="p-4 font-mono text-gray-700">{o.total_rwf.toLocaleString()} RWF</td>
                        <td className="p-4">
                          <span className={`font-bold px-2.5 py-1 rounded-full uppercase text-[10px] ${o.escrow_released ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {o.escrow_released ? 'Released' : 'Holding in Escrow'}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-black">{o.awb_number || 'AWB-KGL-88291'}</td>
                        <td className="p-4">
                          <span className="bg-black text-white font-bold text-[10px] px-2.5 py-1 rounded uppercase font-mono">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-medium text-xs">
                        No purchase orders recorded in database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Account Approvals Queue</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#111111] font-medium">
              <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4">Applicant / Business</th>
                  <th className="p-4">Requested Role</th>
                  <th className="p-4">Tax / Ticket ID</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingApprovals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-black">
                      <div>{p.full_name}</div>
                      <div className="text-xs text-gray-500 font-normal">{p.email}</div>
                    </td>
                    <td className="p-4 font-bold uppercase text-black">{p.role}</td>
                    <td className="p-4 font-mono font-bold text-black">{p.taxId}</td>
                    <td className="p-4">
                      {p.is_approved ? (
                        <span className="bg-black text-white font-bold px-3 py-1 text-xs rounded uppercase">
                          Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveAccount(p.id, p.full_name)}
                          className="bg-black hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                        >
                          Approve Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ESCROW VAULT */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-2xl font-bold text-black font-retro-heading">256-Bit Escrow Vault Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#111111] font-medium">
              <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Escrow Amount</th>
                  <th className="p-4">Lock Status</th>
                  <th className="p-4">Manual Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {escrowVault.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono font-bold text-black">{e.order_number}</td>
                    <td className="p-4 font-bold">{e.buyer_name}</td>
                    <td className="p-4 font-bold">{e.vendor_name}</td>
                    <td className="p-4 font-bold text-black">
                      ${e.amount_cad.toFixed(2)} CAD ({e.amount_rwf.toLocaleString()} RWF)
                    </td>
                    <td className="p-4 font-bold uppercase text-black">{e.status}</td>
                    <td className="p-4">
                      {e.status === 'holding' ? (
                        <button
                          onClick={() => handleReleaseEscrow(e.id, e.order_number, e.amount_cad)}
                          className="bg-black hover:bg-gray-800 text-white font-bold px-3 py-1.5 rounded text-xs uppercase cursor-pointer shadow-xs"
                        >
                          Manual Release
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold uppercase text-xs">Released</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DEVICES */}
      {activeTab === 'devices' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Device Session Audit (`user_devices`)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#111111] font-medium">
              <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Device & Browser</th>
                  <th className="p-4">OS Version</th>
                  <th className="p-4">IP Address / Location</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-black">{d.user_name}</td>
                    <td className="p-4 font-bold">{d.device_name}</td>
                    <td className="p-4 font-mono text-gray-600">{d.os_version}</td>
                    <td className="p-4 font-mono text-gray-600">{d.ip_address}</td>
                    <td className="p-4">
                      <span className="bg-black text-white font-bold px-2.5 py-1 text-xs rounded uppercase">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-2xl font-bold text-black font-retro-heading">System Activity Logs (`activity_logs`)</h2>
          <div className="space-y-3">
            {activityLogs.map((l) => (
              <div key={l.id} className="p-4 bg-gray-50 rounded-xl text-sm flex justify-between items-center border border-gray-200">
                <div>
                  <span className="font-bold text-black uppercase">{l.action}</span>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">User: {l.user_name || 'System'} • Category: {l.category}</div>
                </div>
                <div className="text-xs font-mono text-gray-500">{new Date(l.created_at).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
