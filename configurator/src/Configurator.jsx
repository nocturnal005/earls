import { useReducer, useCallback, useEffect, useRef } from 'react';
import { INITIAL_STATE, FRAME_COLOURS, FRAME_CATALOGUE, FRAME_PROFILES,
  MOUNTING_OPTIONS } from './data.js';
import { SummaryRow, GreenButton, UploadZone } from './components.jsx';
import { SelectPhotoPanel, SizeCropPanel, OptimisationPanel,
  MountingPanel, FramePanel, calcPrice } from './panels.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import { Camera, Crop, Sliders, Layers, Frame,
  X, Check, ChevronLeft, ShoppingCart, UserIcon, GoogleIcon, MicrosoftIcon, AppleIcon } from './Icons.jsx';

/* Portfolio images for aesthetic wall frame display — randomly selected on load */
const PORTFOLIO_IMAGES = [
  '/configurator/dist/samples/reworked 1.jpeg',
  '/configurator/dist/samples/reworked 2.jpeg',
  '/configurator/dist/samples/reworked 3.jpeg',
  '/configurator/dist/samples/reworked 4.jpeg',
  '/configurator/dist/samples/reworked 5.jpeg',
  '/configurator/dist/samples/reworked 6.jpeg',
  '/configurator/dist/samples/reworked 7.jpeg',
  '/configurator/dist/samples/reworked 8.jpeg',
  '/configurator/dist/samples/reworked 9.jpeg',
  '/configurator/dist/samples/reworked 10.jpeg',
];

/* ─── REDUCER ─── */
function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_IMAGE':
      return { ...state, imageLoaded: true, imageSrc: action.src, imageName: action.name, showUploadModal: false, viewMode: 'room' };
    case 'LOAD_SAMPLE': {
      const s = action.sample;
      return { ...state, imageLoaded: true, imageSrc: s.src, imageName: s.label, showUploadModal: false, ...(state.imageLoaded ? {} : { viewMode: 'room' }) };
    }
    case 'SHOW_MODAL': return { ...state, showUploadModal: true };
    case 'HIDE_MODAL': return { ...state, showUploadModal: false };
    case 'SET_VIEW': {
      const extras = action.mode === 'room' ? { zoom3d: 1, rotating3d: false } : {};
      return { ...state, viewMode: action.mode, ...extras };
    }
    case 'SET_PANEL': return { ...state, activePanel: action.panel, cropMode: action.panel === 'size' ? state.cropMode : false };
    case 'SET_RATIO': return { ...state, aspectRatio: action.ratio, selectedSize: null };
    case 'SET_CROP_MODE': return { ...state, cropMode: action.value };
    case 'APPLY_CROP': return { ...state, cropData: action.crop, cropMode: false };
    case 'SET_SIZE': return { ...state, selectedSize: action.size };
    case 'TOGGLE_OPTIMISATION': return { ...state, optimisationEnabled: !state.optimisationEnabled };
    case 'SET_OPTIMISATION': return { ...state, optimisationValue: action.value };
    case 'SET_OPTIMISATION_VIEW': return { ...state, optimisationView: action.view };
    case 'TOGGLE_ULTRAHD': return { ...state, ultraHDEnabled: !state.ultraHDEnabled };
    case 'SET_MOUNTING': return { ...state, selectedMounting: action.id };
    case 'SET_PROFILE': return { ...state, selectedProfile: action.id };
    case 'SET_COLOUR': return { ...state, selectedColour: action.id };
    case 'SET_CATALOGUE_FRAME': return { ...state, selectedCatalogueFrame: action.frame.id, selectedColour: 'catalogue' };
    case 'SET_GLASS': return { ...state, selectedGlass: action.id };
    case 'SET_PAPER': return { ...state, selectedPaper: action.id };
    case 'SET_ROOM': return { ...state, selectedRoom: action.id };
    case 'ZOOM_3D': return { ...state, zoom3d: action.dir === 'in' ? Math.min(state.zoom3d + 0.1, 1.5) : Math.max(state.zoom3d - 0.1, 0.6) };
    case 'TOGGLE_ROTATE': return { ...state, rotating3d: !state.rotating3d };
    case 'STOP_ROTATE': return { ...state, rotating3d: false };
    case 'RESET_3D': return { ...state, zoom3d: 1, rotating3d: false };
    case 'SET_ORIENTATION': return { ...state, orientation: action.orientation };
    case 'SET_QTY': return { ...state, quantity: action.qty };
    case 'SHOW_TOAST': return { ...state, showToast: true };
    case 'HIDE_TOAST': return { ...state, showToast: false };
    case 'ADD_TO_CART': {
      const newItem = {
        id: Date.now(),
        // Capture a clean version of the config
        config: {
          imageSrc: state.imageSrc,
          imageName: state.imageName,
          selectedSize: state.selectedSize,
          selectedMounting: state.selectedMounting,
          selectedProfile: state.selectedProfile,
          selectedColour: state.selectedColour,
          selectedCatalogueFrame: state.selectedCatalogueFrame,
          selectedGlass: state.selectedGlass,
          selectedPaper: state.selectedPaper,
          quantity: state.quantity
        },
        price: action.price,
        timestamp: new Date().toISOString()
      };
      return { ...state, cart: [...state.cart, newItem], showToast: true };
    }
    case 'REMOVE_FROM_CART': return { ...state, cart: state.cart.filter(item => item.id !== action.id) };
    case 'TOGGLE_CART': return { ...state, showCart: !state.showCart };
    case 'TOGGLE_LOGIN': return { ...state, showLogin: !state.showLogin };
    case 'SET_USER': return { ...state, user: action.user, showLogin: false };
    case 'LOGOUT': return { ...state, user: null };
    default: return state;
  }
}

/* ─── MAIN CONFIGURATOR ─── */
export default function Configurator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const userUploadedRef = useRef(false);
  
  // Auto-load: user upload from sessionStorage, or random portfolio image for aesthetics
  useEffect(() => {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const uploadedImageName = sessionStorage.getItem('uploadedImageName') || 'Uploaded Photo';
    if (uploadedImage) {
      dispatch({ type: 'LOAD_IMAGE', src: uploadedImage, name: uploadedImageName });
      sessionStorage.removeItem('uploadedImage');
      sessionStorage.removeItem('uploadedImageName');
      userUploadedRef.current = true;
    } else {
      // Randomly pick a portfolio image for the wall frame display
      const randomSrc = PORTFOLIO_IMAGES[Math.floor(Math.random() * PORTFOLIO_IMAGES.length)];
      dispatch({ type: 'LOAD_SAMPLE', sample: { src: randomSrc, label: 'Portfolio Preview' } });
    }
  }, []);

  // Cycle random portfolio images every 6 seconds — only if user hasn't uploaded
  useEffect(() => {
    const interval = setInterval(() => {
      if (userUploadedRef.current) return;
      const randomSrc = PORTFOLIO_IMAGES[Math.floor(Math.random() * PORTFOLIO_IMAGES.length)];
      dispatch({ type: 'LOAD_SAMPLE', sample: { src: randomSrc, label: 'Portfolio Preview' } });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Track when user uploads their own image
  const dispatchWithTracking = useCallback((action) => {
    if (action.type === 'LOAD_IMAGE') {
      userUploadedRef.current = true;
    }
    dispatch(action);
  }, []);

  const goBack = useCallback(() => dispatch({ type: 'SET_PANEL', panel: null }), []);
  const price = calcPrice(state);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* ─── HEADER ─── */}
      <AppHeader state={state} dispatch={dispatch} />

      <div style={{ flex: 1, marginTop: 80, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>
        {/* ─── LEFT: PREVIEW ─── */}
        <div style={{ width: '60%', height: '100%', position: 'relative', isolation: 'isolate', zIndex: 1 }}>
          {state.imageLoaded ? (
            <PreviewPanel state={state} dispatch={dispatch} />
          ) : (
            <LandingPreview />
          )}
        </div>

      {/* ─── RIGHT: SIDEBAR ─── */}
      <div style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column', background: 'white', borderLeft: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
        {!state.imageLoaded ? (
          <LandingSidebar state={state} dispatch={dispatchWithTracking} />
        ) : state.activePanel ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 10, display: 'flex', flexDirection: 'column' }} className="panel-enter">
            <PanelRouter panel={state.activePanel} state={state} dispatch={dispatchWithTracking} onBack={goBack} />
          </div>
        ) : (
          <SummaryView state={state} dispatch={dispatch} price={price} />
        )}
      </div>
    </div>

      {/* ─── MODALS & DRAWERS ─── */}
      {state.showUploadModal && (
        <UploadModal state={state} dispatch={dispatchWithTracking} />
      )}
      
      {state.showLogin && (
        <LoginModal dispatch={dispatch} />
      )}
      
      {state.showCart && (
        <CartDrawer state={state} dispatch={dispatch} />
      )}

      {/* ─── TOAST ─── */}
      {state.showToast && (
        <div className="fixed bottom-6 right-6 z-50 toast-enter">
          <div className="bg-[#C41E1E] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <Check size={20} />
            <span className="font-medium">Added to basket!</span>
            <button onClick={() => dispatch({ type: 'HIDE_TOAST' })} className="ml-4 opacity-70 hover:opacity-100 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── APP HEADER ─── */
function AppHeader({ state, dispatch }) {
  const cartCount = state.cart.reduce((sum, item) => sum + item.config.quantity, 0);
  
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '80px',
      background: '#181818', borderBottom: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', zIndex: 1000,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
           <img src="assets/images/earls_logo.png" alt="Logo" style={{ height: '40px' }} />
           <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textTransform: 'uppercase', fontFamily: 'serif' }}>Earl's Framing</span>
        </a>
        <nav style={{ display: 'flex', gap: '30px' }}>
          <a href="/#services" style={{ textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>SERVICES</a>
          <a href="/frame-my-photo.html" style={{ textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>FRAME MY PHOTO</a>
          <a href="/#contact" style={{ textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>CONTACT</a>
          <a href="/#gallery" style={{ textDecoration: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>GALLERY</a>
        </nav>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* User Login */}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_LOGIN' })}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', 
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', borderRadius: '40px', border: '1px solid #444',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#444'}
        >
          <UserIcon size={18} color={state.user ? "#fff" : "#ccc"} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
            {state.user ? state.user.name : 'Login'}
          </span>
        </button>

        {/* Basket Icon */}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          style={{ 
            position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: '50%', transition: 'background 0.2s', color: '#fff'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#333'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <ShoppingCart size={24} color="#fff" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px',
              background: '#C41E1E', color: 'white',
              fontSize: '11px', fontWeight: 800,
              minWidth: '18px', height: '18px', borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', border: '2px solid #181818'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ─── LOGIN MODAL ─── */
function LoginModal({ dispatch }) {
  const providers = [
    { id: 'google', name: 'Gmail', icon: <GoogleIcon />, color: '#fff', text: '#333', border: '#e5e7eb' },
    { id: 'microsoft', name: 'Outlook', icon: <MicrosoftIcon />, color: '#fff', text: '#333', border: '#e5e7eb' },
    { id: 'apple', name: 'Apple', icon: <AppleIcon />, color: '#000', text: '#fff', border: '#000' },
  ];

  const handleLogin = (provider) => {
    dispatch({ 
      type: 'SET_USER', 
      user: { name: 'John Doe', email: 'john@example.com', provider: provider.id } 
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }} onClick={() => dispatch({ type: 'TOGGLE_LOGIN' })}>
      <div style={{
        width: '400px', background: 'white', borderRadius: '24px',
        padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_LOGIN' })}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="assets/images/earls_logo.png" alt="Logo" style={{ height: '60px', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: '0 0 8px 0' }}>Welcome back</h2>
          <p style={{ color: '#666', fontSize: '15px' }}>Sign in to save your configurations and orders.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {providers.map(p => (
            <button key={p.id}
              onClick={() => handleLogin(p)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                padding: '14px', borderRadius: '12px', border: `1px solid ${p.border}`,
                background: p.color, color: p.text, fontWeight: 600, fontSize: '15px',
                cursor: 'pointer', transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {p.icon}
              Continue with {p.name}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#999' }}>
          By continuing, you agree to Earl's <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>.
        </p>
      </div>
    </div>
  );
}

/* ─── CART DRAWER ─── */
function CartDrawer({ state, dispatch }) {
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', justifyContent: 'flex-end',
      fontFamily: 'Inter, system-ui, sans-serif'
    }} onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
      <div style={{
        width: '450px', background: 'white', height: '100%',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '32px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: 0 }}>Shopping Basket</h2>
          <button onClick={() => dispatch({ type: 'TOGGLE_CART' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
          {state.cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <div style={{ marginBottom: '24px', color: '#eee' }}>
                <ShoppingCart size={80} />
              </div>
              <p style={{ fontSize: '18px', color: '#888', fontWeight: 600 }}>Your basket is empty</p>
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                style={{ marginTop: '24px', color: '#C41E1E', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Start Framing →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {state.cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f5f5f5', paddingBottom: '24px' }}>
                  <div style={{ width: '80px', height: '80px', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.config.imageSrc} alt="Config" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Floater Frame</h4>
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                      {item.config.selectedSize?.label || 'Custom Size'} • {item.config.imageName}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#C41E1E' }}>£{item.price.toFixed(2)}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>Qty: {item.config.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div style={{ padding: '32px', background: '#fcfcfc', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#555' }}>Subtotal</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#111' }}>£{total.toFixed(2)}</span>
            </div>
            <button style={{
              width: '100%', background: '#C41E1E', color: 'white', padding: '16px',
              borderRadius: '8px', fontSize: '15px', fontWeight: 800, border: 'none',
              cursor: 'pointer', transition: 'background 0.2s'
            }}>
              SECURE CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SECTION 1: LANDING PREVIEW ─── */
function LandingPreview() {
  return (
    <div className="h-full bg-[#E8E8E6] flex items-center justify-center">
      <div className="w-64 h-48 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" stroke="#aaa" strokeWidth="1.5">
          <rect x="2" y="2" width="76" height="56" rx="3" />
          <rect x="6" y="6" width="68" height="48" rx="1" />
          <circle cx="24" cy="22" r="5" />
          <path d="M6 45 L24 28 L44 42 L54 35 L74 48" />
        </svg>
      </div>
    </div>
  );
}

/* ─── SECTION 1: LANDING SIDEBAR ─── */
function LandingSidebar({ state, dispatch }) {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <h1 className="text-xl font-semibold text-[#111] mb-1">Earl's Framing Configurator</h1>
      <p className="text-2xl font-bold mb-1" style={{ color: '#C41E1E' }}>from £39.95</p>
      <p className="text-xs text-[#666] mb-6">Price incl. VAT, excl. shipping</p>

      <GreenButton onClick={() => dispatch({ type: 'SHOW_MODAL' })} fullWidth className="mb-3 text-sm">
        UPLOAD YOUR PHOTO
      </GreenButton>

      <div className="space-y-4 mt-auto">
        {[
          { icon: '📐', label: 'FORMATS', desc: '5 fixed sizes available' },
          { icon: '🚚', label: 'DELIVERY TIME', desc: 'Approx. 12 working days' },
          { icon: '🔩', label: 'WALL MOUNTING INCL.', desc: 'Ready to hang' },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{row.icon}</span>
            <div>
              <p className="text-xs font-semibold text-[#111] uppercase">{row.label}</p>
              <p className="text-xs text-[#666]">{row.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SECTION 2: UPLOAD MODAL ─── */
function UploadModal({ state, dispatch }) {
  const handleFile = (src, name) => {
    dispatch({ type: 'LOAD_IMAGE', src, name });
  };
  const handleClose = () => {
    dispatch({ type: 'HIDE_MODAL' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-[#999] hover:text-[#111] cursor-pointer">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-[#111] mb-4">Upload Your Photo</h2>
        <UploadZone onFileSelect={handleFile} />
      </div>
    </div>
  );
}

/* ─── SECTION 3 & 11: SUMMARY VIEW ─── */
function SummaryView({ state, dispatch, price }) {
  const mountName = MOUNTING_OPTIONS.find(m => m.id === state.selectedMounting)?.label.split(' · ')[1] || '—';
  const profileObj = FRAME_PROFILES.find(f => f.id === state.selectedProfile);
  const colourObj = FRAME_COLOURS.find(c => c.id === state.selectedColour);
  const catalogueFrame = state.selectedCatalogueFrame ? FRAME_CATALOGUE.find(f => f.id === state.selectedCatalogueFrame) : null;


  const frameName = catalogueFrame
    ? `${profileObj?.name || '—'}, ${catalogueFrame.name}`
    : profileObj ? `${profileObj.name}, ${colourObj?.name || '—'}` : '—';

  
  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', price: price });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  };

  // Exact values from WhiteWall reference screenshot
  const sizeLabel = state.selectedSize?.label || 'Not selected';
  const sizeDetail = state.selectedSize ? `${sizeLabel} (External dimensions: ${(state.selectedSize.w + 4.4).toFixed(1)} x ${(state.selectedSize.h + 4.4).toFixed(1)} cm)` : 'Select a size to continue';

  /* Image processing rows */
  const imageRows = [
    { icon: <Camera size={22} />, label: 'SELECT PHOTO', value: state.imageName === 'Landscape' ? 'Sample Image 12' : state.imageName, panel: 'photo' },
    { icon: <Crop size={22} />, label: 'IMAGE SIZE & CROP PHOTO', value: <><span style={{ color: '#555' }}>{sizeDetail}</span><br/><span style={{ color: '#999', fontSize: '11px' }}>Earl's SuperResolution activated</span></>, panel: 'size' },
    { icon: <Sliders size={22} />, label: 'IMAGE OPTIMISATION', value: `${state.optimisationValue}%`, panel: 'optimisation' },
  ];

  /* Frame & finishing rows */
  const finishingRows = [
    { icon: <Frame size={22} />, label: 'FRAME', value: <><span style={{ color: '#555' }}>{frameName}</span>{profileObj?.price > 0 && <><br/><span style={{ color: '#C41E1E', fontSize: '11px', fontWeight: 600 }}>+£{profileObj.price.toFixed(2)}</span></>}</>, panel: 'frame' },
    { icon: <Layers size={22} />, label: 'MOUNTING', value: <><span style={{ color: '#555' }}>{mountName}</span></>, panel: 'mounting' },

  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {/* Header — "Floater Frame" + frame corner thumbnail */}
        <div data-summary-header="true" style={{ padding: '32px 24px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111', lineHeight: 1.2, marginBottom: '4px' }}>Floater Frame</h2>
            <button style={{ color: '#C41E1E', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Change product</button>
          </div>
          {/* Frame corner thumbnail — reflects selected colour */}
          <div style={{ width: '64px', height: '48px', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
            <svg viewBox="0 0 56 44" fill="none" style={{ width: '100%', height: '100%' }}>
              <rect x="4" y="4" width="48" height="36" rx="1" fill="#f5f5f5" stroke="#ddd" strokeWidth="0.5" />
              <rect x="8" y="8" width="40" height="28" fill="#e8e0d0" />
              <rect x="10" y="10" width="36" height="24" fill={colourObj?.hex || '#d4c8b4'} />
              <rect x="14" y="14" width="28" height="16" fill={colourObj?.hex ? `${colourObj.hex}dd` : '#2a2a2a'} />
              <line x1="10" y1="10" x2="46" y2="10" stroke="white" strokeWidth="0.5" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Image processing rows */}
        <div data-divider-top="true" style={{ borderTop: '1px solid #e5e7eb' }}>
          {imageRows.map((r, i) => (
            <div key={i} data-divider-row="true" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <SummaryRow icon={r.icon} label={r.label} value={r.value}
                onClick={() => dispatch({ type: 'SET_PANEL', panel: r.panel })} />
            </div>
          ))}
        </div>

        {/* Section divider — Frame & Finishing */}
        <div style={{
          padding: '14px 24px 10px 24px',
          background: '#f8f8f7',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#999',
          }}>Frame & Finishing</span>
        </div>

        {/* Frame & finishing rows */}
        <div>
          {finishingRows.map((r, i) => (
            <div key={i} data-divider-row="true" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <SummaryRow icon={r.icon} label={r.label} value={r.value}
                onClick={() => dispatch({ type: 'SET_PANEL', panel: r.panel })} />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer — pricing + add to cart (WhiteWall layout replica) */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        padding: '20px 24px 18px 24px',
        background: 'white',
        flexShrink: 0,
      }}>
        {/* Price row — left: "Price incl. VAT..." / right: bold price */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', color: '#888' }}>
            Price incl. VAT, excl.{' '}
            <span style={{ color: '#C41E1E', cursor: 'pointer' }}>shipping</span>
          </span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#C41E1E', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }}>
            £ {price.toFixed(2)}
          </span>
        </div>

        {/* Quantity + Add to Cart row */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {/* Quantity dropdown */}
          <div style={{ position: 'relative', width: '100px', flexShrink: 0 }}>
            <select
              value={state.quantity}
              onChange={(e) => dispatch({ type: 'SET_QTY', qty: parseInt(e.target.value) })}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '54px',
                appearance: 'none',
                WebkitAppearance: 'none',
                border: '1px solid #ccc',
                borderRadius: '0',
                paddingLeft: '18px',
                paddingRight: '36px',
                fontSize: '16px',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                color: '#333',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {[1, 2, 3, 4, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <div style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#666',
            }}>
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* ADD TO CART button — Earl's red */}
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              background: '#C41E1E',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'background 0.2s',
              minHeight: '54px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#A31818'}
            onMouseLeave={e => e.currentTarget.style.background = '#C41E1E'}
          >
            ADD TO CART
          </button>
        </div>

        {/* Delivery info */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#777',
          margin: '0 0 14px 0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          Standard delivery approx. 12 Working days
        </p>

        {/* Footer links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '13px',
          color: '#999',
          fontWeight: 400,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          <a href="#" style={{ color: '#555', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Terms & Conditions</a>
          <span style={{ color: '#ccc' }}>|</span>
          <a href="#" style={{ color: '#555', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Privacy policy</a>
          <span style={{ color: '#ccc' }}>|</span>
          <a href="#" style={{ color: '#555', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Cookie Settings</a>
          <span style={{ color: '#ccc' }}>|</span>
          <a href="#" style={{ color: '#555', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Legal Info</a>
        </div>
      </div>
    </div>
  );
}

/* ─── PANEL ROUTER ─── */
function PanelRouter({ panel, state, dispatch, onBack }) {
  switch (panel) {
    case 'photo': return <SelectPhotoPanel state={state} dispatch={dispatch} onBack={onBack} />;
    case 'size': return <SizeCropPanel state={state} dispatch={dispatch} onBack={onBack} />;
    case 'optimisation': return <OptimisationPanel state={state} dispatch={dispatch} onBack={onBack} />;
    case 'mounting': return <MountingPanel state={state} dispatch={dispatch} onBack={onBack} />;
    case 'frame': return <FramePanel state={state} dispatch={dispatch} onBack={onBack} />;

    default: return null;
  }
}
