/*
  MobileTabBar — iOS Liquid Glass bottom tab bar
  ────────────────────────────────────────────────
  Spec:
  • Visible only below md (< 768px)
  • Height: 49px + env(safe-area-inset-bottom) — exact iOS tab bar height
  • Material: rgba(242,242,247,0.88) + saturate(200%) blur(32px)
              inset 0 1px 0 rgba(255,255,255,0.90)  ← inner highlight
              0.5px top separator  ← iOS tab bar separator
  • 4 tabs: Add Product | Create Bill | Stock Entry | Reports
  • Each tab navigates to its route (NOT dashboard)
  • Active = current route exactly matches tab path
  • Active icon: tinted pill background + system color
  • Inactive: systemGray (#8E8E93) icon, no background
  • Active label: visible, colored, 10pt
  • Inactive label: always visible, gray, 10pt
  • Spring scale animation on press
*/

import { useNavigate, useLocation } from "react-router-dom"
import { Plus, ShoppingCart, Package, BarChart3 } from "lucide-react"
import { useTranslation } from "react-i18next"

const TABS = [
  {
    key:       "add_product_action",
    icon:      Plus,
    path:      "/admin/products",
    color:     "#34C759",
    darkColor: "#30D158",
    pillBg:    "rgba(52,199,89,0.14)",
  },
  {
    key:       "create_bill",
    icon:      ShoppingCart,
    path:      "/admin/billing",
    color:     "#007AFF",
    darkColor: "#0A84FF",
    pillBg:    "rgba(0,122,255,0.14)",
  },
  {
    key:       "stock_entry",
    icon:      Package,
    path:      "/admin/purchases",
    color:     "#FF9500",
    darkColor: "#FF9F0A",
    pillBg:    "rgba(255,149,0,0.14)",
  },
  {
    key:       "reports",
    icon:      BarChart3,
    path:      "/admin/reports",
    color:     "#AF52DE",
    darkColor: "#BF5AF2",
    pillBg:    "rgba(175,82,222,0.14)",
  },
]

export function MobileTabBar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { t }     = useTranslation()

  return (
    /* Fixed at bottom, mobile-only */
    <div
      className="md:hidden"
      style={{
        position:      "fixed",
        bottom:        0,
        left:          0,
        right:         0,
        zIndex:        100,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/*
        Liquid Glass shell
        ─────────────────
        • rgba(242,242,247,0.88) — systemGroupedBackground at 88%
        • saturate(200%) blur(32px) — heavier than navbar to
          really blur the content scrolling behind it
        • inset 0 1px 0 rgba(255,255,255,0.90) — top edge highlight
          (most important — this is what makes it look like glass)
        • 0.5px rgba(60,60,67,0.22) top border — iOS hairline separator
        • Ambient shadow upward — lifts bar off content
      */}
      <div style={{
        /* Frosted glass material */
        background:          "rgba(242,242,247,0.88)",
        backdropFilter:      "saturate(200%) blur(32px)",
        WebkitBackdropFilter:"saturate(200%) blur(32px)",
        /* Hairline top separator */
        borderTop:           "0.5px solid rgba(60,60,67,0.22)",
        /* Inner top highlight + upward shadow */
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.90)," +
          "0 -2px 24px rgba(0,0,0,0.07)," +
          "0 -1px 6px  rgba(0,0,0,0.04)",
        /* Layout */
        display:    "flex",
        alignItems: "stretch",
        height:     49,
      }}
      /* Dark mode overrides */
      className="dark:[background:rgba(0,0,0,0.84)] dark:[border-top-color:rgba(84,84,88,0.55)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.07),0_-2px_24px_rgba(0,0,0,0.50)]"
      >
        {TABS.map((tab) => {
          const active = location.pathname === tab.path
          const Icon   = tab.icon

          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              style={{
                flex:                    1,
                display:                 "flex",
                flexDirection:           "column",
                alignItems:              "center",
                justifyContent:          "center",
                gap:                     3,
                border:                  "none",
                background:              "transparent",
                cursor:                  "pointer",
                padding:                 "5px 2px 4px",
                WebkitTapHighlightColor: "transparent",
                userSelect:              "none",
                transition:              "opacity 0.12s ease",
                outline:                 "none",
                position:                "relative",
              }}
              className="active:opacity-55"
            >
              {/*
                Icon container
                ─────────────
                Active: tinted pill (wider than tall — iOS style)
                         with system color icon + spring scale
                Inactive: no background, systemGray icon
              */}
              <div style={{
                width:          active ? 44 : 26,
                height:         active ? 26 : 26,
                borderRadius:   active ? 13 : 8,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                background:     active ? tab.pillBg : "transparent",
                /* Spring-like expand animation */
                transition:     "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink:     0,
              }}>
                <Icon style={{
                  width:        22,
                  height:       22,
                  color:        active ? tab.color : "#8E8E93",
                  strokeWidth:  active ? 2.3 : 1.9,
                  transition:   "color 0.18s ease, stroke-width 0.18s ease",
                  flexShrink:   0,
                }} />
              </div>

              {/*
                Label — always visible per iOS convention
                Active: system color, semibold
                Inactive: systemGray, regular weight
              */}
              <span style={{
                fontSize:     10,
                fontWeight:   active ? 600 : 400,
                color:        active ? tab.color : "#8E8E93",
                lineHeight:   1,
                letterSpacing: active ? "-0.01em" : "0",
                whiteSpace:   "nowrap",
                maxWidth:     "100%",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                transition:   "color 0.15s ease, font-weight 0.15s ease",
              }}>
                {t(tab.key)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
